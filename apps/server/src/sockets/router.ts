/* SPDX-FileCopyrightText: 2025-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import type { Server, ServerWebSocket, WebSocketHandler } from "bun";
import { v4 as randomUUIDv7 } from "uuid";
import { z } from "zod";
import { WebSocketHandlers } from "./handlers";
import type {
  CloseHandler,
  MessageHandler,
  MessageSchemaType,
  OpenHandler,
  SendFunction,
  UpgradeOptions,
  WebSocketData,
  WebSocketRouterOptions,
} from "./types";
import PgRealtimeClient from "@/services/update.service";
import {
  EventCallback,
  PendingEvent,
  PgRealtimeClientOptions,
} from "@/services/dbupdates/types";

const pgOptions: PgRealtimeClientOptions = {
  user: "postgres",
  password: "password",
  host: "192.168.1.35",
  port: 5432,
  database: "dev",
  // minPoolConnections?: number;
  // maxPoolConnections?: number;
  // channel?: string;
  // bufferInterval?: number;
  // maxBufferSize?: number;
  onError: (error: Error) => console.log(error),
};
/**
 * Creates a new Spec Realtime Client.
 */
const createRealtimeClient = (
  options?: PgRealtimeClientOptions
): PgRealtimeClient => {
  return new PgRealtimeClient(options);
};

export { createRealtimeClient, PgRealtimeClient };
export * from "@/services/dbupdates/types";
/**
 * WebSocket router for Bun that provides type-safe message routing with Zod validation.
 * Routes incoming messages to handlers based on message type.
 *
 * @template T - Application-specific data to store with each WebSocket connection.
 *               Always includes a clientId property generated automatically.
 */
export class WebSocketRouter<
  T extends Record<string, unknown> = Record<string, never>,
> {
  public server: Server;
  private readonly handlers = new WebSocketHandlers<WebSocketData<T>>();
  public pgUpdatesClient: PgRealtimeClient;
  public connectedClients: ServerWebSocket<WebSocketData<T>>[];
  constructor(options?: WebSocketRouterOptions) {
    this.server = options?.server ?? (undefined as unknown as Server);
    this.connectedClients = [];
  }
  addServer(server: Server) {
    this.server = server;
  }
  /**
   * Merges open, close, and message handlers from another WebSocketRouter instance.
   */
  addRoutes(ws: WebSocketRouter<T>): this {
    ws.handlers.message.forEach((handler, value) => {
      this.handlers.message.set(value, handler);
    });
    this.handlers.open.push(...ws.handlers.open);
    this.handlers.close.push(...ws.handlers.close);
    return this;
  }
  setupDbListener(): this {
    try {
      this.pgUpdatesClient = createRealtimeClient(pgOptions);
      this.pgUpdatesClient._createSubscriber();
      // export interface Event {
      //   timestamp: string;
      //   operation: Operation;
      //   schema: string;
      //   table: string;
      //   data: StringKeyMap;
      //   columnNamesChanged?: string[];
      // }
      this.pgUpdatesClient.table("user", { schema: "public" });
      this.pgUpdatesClient
        .table("profiles", { schema: "public" })
        .onUpdate((data: any) => {
          console.log(data);
          const event = data as unknown as PendingEvent;
          if (this.server) {
            // this.server.publish("db_updates", JSON.stringify(data), false);
            console.log(this.server.subscriberCount("db_updates"));
            this.connectedClients.forEach((client) => {
              if (event.table === "user")
                if (client.data.userId === event.primaryKeyData["id"]) {
                  client.send(data);
                }
              if (event.table === "profiles")
                if (client.data.userId === event.data.userId) {
                  client.send(data);
                }
            });
          }
        });

      this.pgUpdatesClient.listen();
    } catch (e) {
      console.log(e);
    }
    return this;
  }
  /**
   * Upgrades an HTTP request to a WebSocket connection.
  //  */
  public upgrade(req: Request, options: UpgradeOptions<WebSocketData<T>>) {
    const { server, data, headers } = options;
    const clientId = randomUUIDv7();
    const upgraded = server.upgrade(req, {
      data: { clientId, ...data },
      headers: {
        "x-client-id": clientId,
        ...headers,
      },
    });

    if (!upgraded) {
      return new Response(
        "Failed to upgrade the request to a WebSocket connection",
        {
          status: 500,
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
    }
    return new Response(null, data);
  }

  onOpen(handler: OpenHandler<WebSocketData<T>>): this {
    this.handlers.open.push(handler);

    console.log("opened");
    return this;
  }

  onClose(handler: CloseHandler<WebSocketData<T>>): this {
    this.handlers.close.push(handler);
    return this;
  }

  onMessage<Schema extends MessageSchemaType>(
    schema: Schema,
    handler: MessageHandler<Schema, WebSocketData<T>>
  ): this {
    const messageType = schema.shape.type._def.value;
    if (this.handlers.message.has(messageType)) {
      console.warn(
        `Handler for message type "${messageType}" is being overwritten.`
      );
    }

    this.handlers.message.set(messageType, {
      schema,
      handler: handler as MessageHandler<MessageSchemaType, WebSocketData<T>>,
    });

    return this;
  }

  /**
   * Returns a WebSocket handler that can be used with `Bun.serve`.
   */
  get websocket(): WebSocketHandler<WebSocketData<T>> {
    return {
      open: this.handleOpen.bind(this),
      message: this.handleMessage.bind(this),
      close: this.handleClose.bind(this),
    };
  }

  // ———————————————————————————————————————————————————————————————————————————
  // Private methods
  // ———————————————————————————————————————————————————————————————————————————

  private handleOpen(ws: ServerWebSocket<WebSocketData<T>>) {
    const clientId = ws.data.clientId;

    console.log(`[ws] Connection opened: ${clientId}`);
    const userId = ws.data.userId;
    const context = {
      ws,
      send: this.createSendFunction(ws),
    };
    // console.log(this.handlers)
    // Execute all registered open handlers
    this.handlers.open.forEach((handler) => {
      try {
        // Call the handler, passing the WebSocket instance
        const result = handler(context);
        // Handle async handlers if they return a promise
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(
              `Unhandled promise rejection in open handler for ${clientId}:`,
              error
            );
          });
        }
      } catch (error) {
        console.error(`Error in open handler for ${clientId}:`, error);
        // ws.close(1011, "Internal server error during connection setup");
      }
    });

    // ws.data.userId || `guest-${Math.random().toString(36).substring(2, 9)}`
    // ws.data.userId = userId
    // ws.data.username = ws.data.username || 'Anonymous' // Set a default username

    // connectedClients.set(userId, ws)
    console.log(
      `WebSocket connection opened for user: ${userId} (username: ${ws.data.username})`
    );
    ws.send(
      JSON.stringify({
        type: "connection_ack",
        message: "Connected to WebSocket server!",
        userId,
      })
    );

    // Subscribe to a default room or based on ws.data.roomId
    const roomId = "db_updates";
    ws.subscribe(roomId);
    console.log(`User ${userId} subscribed to room: ${roomId}`);
    // Announce new user to the room
    this.server.publish(
      roomId,
      JSON.stringify({
        type: "user_join",
        username: ws.data.username,
        userId: ws.data.userId,
        timestamp: new Date().toISOString(),
      })
    );
    this.connectedClients.push(ws);
  }

  private handleClose(
    ws: ServerWebSocket<WebSocketData<T>>,
    code: number,
    reason?: string
  ) {
    const clientId = ws.data.clientId;
    console.log(
      `[ws] Connection closed: ${clientId} (Code: ${code}, Reason: ${
        reason || "N/A"
      })`
    );

    const context = {
      ws,
      code,
      reason,
      send: this.createSendFunction(ws),
    };

    // Execute all registered close handlers
    this.handlers.close.forEach((handler) => {
      try {
        // Call the handler, passing the WebSocket instance, code, and reason
        const result = handler(context);
        // Handle async handlers if they return a promise
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(
              `[ws] Unhandled promise rejection in close handler for ${clientId}:`,
              error
            );
          });
        }
      } catch (error) {
        // Catch synchronous errors in handlers
        console.error(`[ws] Error in close handler for ${clientId}:`, error);
      }
    });
  }

  private handleMessage(
    ws: ServerWebSocket<WebSocketData<T>>,
    message: string | Buffer
  ) {
    const clientId = ws.data.clientId;
    let parsedMessage: unknown;

    try {
      // Assuming messages are JSON strings
      if (typeof message === "string") {
        parsedMessage = JSON.parse(message);
      } else if (message instanceof Buffer) {
        // Or handle Buffer messages if needed, e.g., parse as JSON
        parsedMessage = JSON.parse(message.toString());
      } else {
        console.warn(
          `[ws] Received non-string/buffer message from ${clientId}`
        );
        return;
      }

      // Basic validation for message structure (must have a 'type' property)
      if (
        typeof parsedMessage !== "object" ||
        parsedMessage === null ||
        typeof (parsedMessage as { type: unknown }).type !== "string"
      ) {
        console.warn(
          `[ws] Received invalid message format from ${clientId}:`,
          parsedMessage
        );
        // Optionally send an error message back or close the connection
        // ws.send(JSON.stringify({ error: "Invalid message format" }));
        // ws.close(1003, "Invalid message format");
        return;
      }
    } catch (error) {
      console.error(`[ws] Failed to parse message from ${clientId}:`, error);
      // Optionally send an error message back or close the connection
      // ws.send(JSON.stringify({ error: "Invalid JSON" }));
      // ws.close(1003, "Invalid JSON");
      return;
    }
    const messageType = (parsedMessage as { type: string }).type;
    const handlerEntry = this.handlers.message.get(messageType);

    if (!handlerEntry) {
      console.warn(
        `[ws] No handler found for message type "${messageType}" from ${clientId}`
      );
      // Optionally send a message indicating the type is unsupported
      ws.send(
        JSON.stringify({ error: `Unsupported message type: ${messageType}` })
      );
      return;
    }

    const { schema, handler } = handlerEntry;

    try {
      // Validate the message against the registered schema
      const validationResult = schema.safeParse(parsedMessage);

      if (!validationResult.success) {
        console.error(
          `[ws] Message validation failed for type "${messageType}" from ${clientId}:`,
          validationResult.error.errors // Log Zod errors
        );
        // Optionally send detailed validation errors back (be cautious with sensitive info)
        // ws.send(JSON.stringify({ error: "Validation failed", details: validationResult.error.flatten() }));
        // ws.close(1007, "Invalid message payload");
        return;
      }

      // Prepare the context for the handler
      const validatedData = validationResult.data;
      const context = {
        ws,
        type: validatedData.type, // Already known, but include for consistency
        meta: validatedData.meta,
        // Conditionally add payload if it exists in the schema and data
        ...(validatedData.payload !== undefined && {
          payload: validatedData.payload,
        }),
        send: this.createSendFunction(ws),
      };

      // Execute the handler
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = handler(context as any);

      // Handle async handlers
      if (result instanceof Promise) {
        result.catch((error) => {
          console.error(
            `[ws] Unhandled promise rejection in message handler for type "${messageType}" from ${clientId}:`,
            error
          );
        });
      }
    } catch (error) {
      // Catch synchronous errors in handlers
      console.error(
        `[ws] Error in message handler for type "${messageType}" from ${clientId}:`,
        error
      );
      // Optionally close the connection on handler error
      // ws.close(1011, "Internal server error during message handling");
    }
  }

  /**
   * Creates a send function for a specific WebSocket connection.
   * This function allows handlers to send typed messages with proper validation.
   */
  private createSendFunction(
    ws: ServerWebSocket<WebSocketData<T>>
  ): SendFunction {
    return <Schema extends MessageSchemaType>(
      schema: Schema,
      payload: Schema["shape"] extends { payload: infer P }
        ? P extends z.ZodTypeAny
          ? z.infer<P>
          : unknown
        : unknown,
      meta: Partial<z.infer<Schema["shape"]["meta"]>> = {}
    ) => {
      try {
        // Extract the message type from the schema
        const messageType = schema.shape.type._def.value;

        // Create the message object with the required structure
        const message = {
          type: messageType,
          meta: {
            clientId: ws.data.clientId,
            timestamp: Date.now(),
            ...meta,
          },
          ...(payload !== undefined && { payload }),
        };

        // Validate the constructed message against the schema
        const validationResult = schema.safeParse(message);

        if (!validationResult.success) {
          console.error(
            `[ws] Failed to send message of type "${messageType}": Validation error`,
            validationResult.error.errors
          );
          return;
        }

        // Send the validated message
        ws.send(JSON.stringify(validationResult.data));
      } catch (error) {
        console.error(`[ws] Error sending message:`, error);
      }
    };
  }
}

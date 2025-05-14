import type { Server, ErrorLike } from "bun";
import { ExecutionContext } from "hono";

// Local Imports
import { WebSocketRouter } from "./sockets/router"; // Use the single router
import type { WsData } from "./sockets/types";

// Import Schemas (needed for registration keys)
import * as Schema from "./sockets/schema";

// Import ACTUAL Handler Functions
import {
  handleJoinRoom,
  handleSendMessage,
} from "./sockets/handlers/chat.handler";
import { handlePing } from "./sockets/handlers/heartbeat.handler";
// import { handleSubscribe } from "./sockets/handlers/realtime.handler";
import { PgRealtimeClientOptions } from "./rest/services/dbupdates/types";
import { RealtimeService } from "./sockets/services/realtime.service";
import createApp from "./rest/create-app";
import { auth } from "./rest/auth";

// --- Configuration ---
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 6589;
const HOSTNAME = process.env.HOSTNAME || "0.0.0.0";

const pgOptions: PgRealtimeClientOptions = {
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  database: process.env.DB_NAME || "dev",
  channel: process.env.DB_LISTEN_CHANNEL || "spec_data_change",
  onError: (error: Error) => console.error("[DB Listener Error]", error),
};

// --- Initialization ---
console.log("[Server] Initializing application...");
const app = createApp();
const realtimeService = new RealtimeService(pgOptions);
type AppWsData = Omit<WsData, "clientId"> & { userId: string };
const wsRouter = new WebSocketRouter<AppWsData>(); // Initialize WITHOUT server yet

// --- Register WebSocket Message Handlers ---
// Directly register the imported handler functions
console.log("[Server] Registering WebSocket handlers...");
try {
  wsRouter.onMessage(Schema.JoinRoom, handleJoinRoom);
  wsRouter.onMessage(Schema.SendMessage, handleSendMessage);
  wsRouter.onMessage(Schema.Ping, handlePing);
  // wsRouter.onMessage(Schema.Subscribe, handleSubscribe);
  // wsRouter.onMessage(Schema.RoomList, handleRoomList); // Register other handlers
  console.log("[Server] WebSocket handlers registered.");
} catch (error) {
  console.error("[Server] FATAL: Error registering WebSocket handlers:", error);
  process.exit(1);
}

// --- Define the WebSocket Handler Object ---
const websocketHandler = wsRouter.websocket;

// --- Start Bun Server ---
console.log(`[Server] Attempting to start server on ${HOSTNAME}:${PORT}...`);
let serverInstance: Server;

try {
  serverInstance = Bun.serve<AppWsData, {}>({
    port: PORT,
    hostname: HOSTNAME,

    async fetch(req, server): Promise<Response> {
      const url = new URL(req.url);

      // WebSocket Upgrade Handling
      if (url.pathname === "/ws") {
        // console.log(`[Server] WS upgrade request received for ${url.pathname}`);
        let sessionId: string | null = null;
        const authHeader = req.headers.get("Authorization");
        if (authHeader?.startsWith("Bearer "))
          sessionId = authHeader.substring(7);

        if (!sessionId) {
          console.warn("[WS Upgrade] Denied: No session ID found.");
          return new Response("Unauthorized: Authentication required.", {
            status: 401,
          });
        }
        try {
          // const { session, user } = await validateSession(sessionId);
          const session = await auth.api.getSession({
            headers: req.headers,
          });
          const user = session!.user;
          if (!session || !user || !user.id) {
            console.warn(`[WS Upgrade] Denied: Invalid session ID.`);
            return new Response("Unauthorized: Invalid session.", {
              status: 401,
            });
          }
          // console.log(`[WS Upgrade] Auth successful for user: ${user.id}`);
          const upgradeResponse = wsRouter.upgrade({
            server, // Pass the server instance from THIS context
            request: req,
            data: { userId: user.id },
          });
          if (upgradeResponse instanceof Response) return upgradeResponse;
          return new Response(null, { status: 101 }); // Handled by Bun
        } catch (error: any) {
          if (error?.message === "AUTH_INVALID_SESSION_ID") {
            console.warn(
              `[WS Upgrade] Denied: Invalid session ID (validation error)`
            );
            return new Response("Unauthorized: Invalid session.", {
              status: 401,
            });
          }
          console.error("[WS Upgrade] Error:", error);
          return new Response("Internal Server Error during upgrade.", {
            status: 500,
          });
        }
      }

      // Regular HTTP Request Handling
      const honoEnv = { serverInstance: server };
      try {
        // Provide a minimal ExecutionContext implementation
        const executionContext: ExecutionContext = {
          waitUntil(promise: Promise<any>) {
            // Optionally handle background tasks here
          },
          passThroughOnException() {
            // Optionally handle pass-through logic here
          },
        };
        return await app.fetch(req, honoEnv, executionContext);
      } catch (error) {
        console.error("[Hono Fetch Error]", error);
        return new Response("Internal Server Error", { status: 500 });
      }
    },
    websocket: websocketHandler,
    error(error: ErrorLike): Response | Promise<Response> {
      console.error("[Bun Server Error]", error);
      return new Response(`Server error: ${error.message || "Unknown error"}`, {
        status: 500,
      });
    },
  });

  // --- Post-Initialization ---
  console.log("[Server] Server instance created. Setting dependencies...");
  wsRouter.setServer(serverInstance); // Inject server instance into router
  realtimeService.setServer(serverInstance); // Inject server instance into service

  console.log("[Server] Starting RealtimeService listeners...");
  realtimeService.startListening().catch((err) => {
    console.error(
      "[Server] FATAL: Failed to start RealtimeService listening, exiting.",
      err
    );
    serverInstance.stop(true);
    process.exit(1);
  });

  console.log(
    `🚀 Server listening on http://${serverInstance.hostname}:${serverInstance.port}`
  );
} catch (error) {
  console.error("[Server] FATAL: Failed to start:", error);
  process.exit(1);
}

// --- Graceful Shutdown ---
const shutdown = async (signal: string) => {
  console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
  try {
    if (realtimeService) await realtimeService.stopListening();
    if (serverInstance) serverInstance.stop(true);
    console.log("[Server] Stopped.");
    process.exit(0);
  } catch (error) {
    console.error("[Server] Error during graceful shutdown:", error);
    process.exit(1);
  }
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Export Hono app type
export type CashflowServerAppType = typeof app;
function validateSession(
  sessionId: string
): { session: any; user: any } | PromiseLike<{ session: any; user: any }> {
  throw new Error("Function not implemented.");
}

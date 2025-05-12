import { WebSocketRouter, publish } from ".";
import {
  Subscribe,
  SubscribeResponse,
  // SendMessage,
  // UserJoined,
  // RoomList,
  // UserLeft,
} from "./schema";
import PgRealtimeClient from "@/services/update.service";
import { PgRealtimeClientOptions } from "@/services/dbupdates/types";
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
//
// Store active room connections for later use
type WebSocketData = { roomId?: string } & Record<string, unknown>;

const ws = new WebSocketRouter<WebSocketData>();

ws.onMessage(Subscribe, (c) => {
  const userId = c.ws.data.userId as string;
  // Store roomId in connection data for use in onClose handler
  // console.log(roomId)
  // console.log(userId)
  if (!userId) return;
  // Subscribe the client to the room
  c.ws.subscribe(`heartbeat-${userId}`);
  console.log(`User ${userId} started heartbeat`);
  // Send confirmation back to the user who joined
  const timestamp = new Date().getTime();
  c.send(SubscribeResponse, {
    userId,
    content: "Pong",
    timestamp,
  });

  // Broadcast to other users in the room that someone joined.
  // Only publish if userId is available.
  // if (userId) {
  //   publish(c.ws, roomId, UserJoined, {
  //     userId,
  //   });
  // }
});

// ws.onMessage(SendMessage, (c) => {
//   const { roomId, text } = c.payload;
//   const userId = c.ws.data.userId as string;
//   console.log(`Message from ${userId} in room ${roomId}: ${text}`);
//   // Broadcast message to all subscribers, validating with schema
//   // Only publish if userId is available
//   if (userId) {
//     publish(c.ws, roomId, NewMessage, {
//       roomId,
//       userId,
//       text,
//       timestamp: Date.now(),
//     });
//   }
// });
// ws.onMessage(RoomList, (c) => {
//   const { roomId } = c.payload;
//   const userId = c.ws.data.userId as string;
//   console.log(`Message from ${userId} in room ${roomId}`);
//   // Broadcast message to all subscribers, validating with schema
//   // Only publish if userId is available
//   const text = "";
//   if (userId) {
//     publish(c.ws, roomId, NewMessage, {
//       roomId,
//       userId,
//       text,
//       timestamp: Date.now(),
//     });
//   }
// });
ws.onClose((c) => {
  const clientId = c.ws.data.clientId;
  const roomId = c.ws.data.roomId;

  console.log(`Connection closed: ${clientId}`);

  // If user was in a room, notify others they left
  if (roomId && clientId) {
    // Unsubscribe from the room
    c.ws.unsubscribe(roomId);

    // Broadcast user left notification, validating with schema
    // publish(c.ws, roomId, UserLeft, {
    //   roomId,
    //   userId: clientId,
    // });

    console.log(`User ${clientId} left room: ${roomId}`);
  }
});

export { ws as realtimeRouter };

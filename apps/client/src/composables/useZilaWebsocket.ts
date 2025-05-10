// // src/composables/useWebSocketNotifications.ts
// // import { connectTo, WSStatus, ZilaConnection } from '@/services/wsClient'
// import { useNotificationStore } from "@/stores/notifications";
// import { useUserStore } from "@/stores/user";
// // import { useQuery, useQueryClient } from '@tanstack/vue-query'
// import type {
//   ProfileStatsUpdateData,
//   StatsUpdate,
//   UserStatsUpdateData,
// } from "@cashflow/types";
// import { useQueryClient } from "@tanstack/vue-query";
// import { readonly, ref, shallowRef } from "vue"; // Import shallowRef and readonly

// // --- Define Message Structures (Keep these or adapt) ---
// interface WebSocketNotificationMessage {
//   type: "server_notification";
//   payload: {
//     message: string;
//     level?: "info" | "success" | "warning" | "error";
//     displayDuration?: number;
//   };
// }
// interface WebSocketStatUpdateMessage {
//   type: "profiles_change";
//   data: any;
// }
// // interface MessageToServer {
// //   type: string
// //   payload: ActionPayload<any> | CommandPayload<any> | SubscribePayload<any>
// // }
// interface MessageToServer {
//   type: string;
//   data: any; //ActionPayload<any> | CommandPayload<any> | SubscribePayload<any>
// }
// // Default filter function (can be overridden during initialization)
// const defaultIsNotificationMessage = (
//   data: any
// ): data is WebSocketNotificationMessage =>
//   data &&
//   typeof data === "object" &&
//   data.type === "server_notification" &&
//   data.payload?.message;

// const defaultIsStatsUpdateMessage = (
//   data: any
// ): data is WebSocketStatUpdateMessage =>
//   data &&
//   typeof data === "object" &&
//   data.type === "profiles_change" &&
//   data.data;

// // --- Module-level Shared State (Singleton Pattern) ---

// let _client: ZilaConnection; // The raw instance from useWebSocket
// const _isInitialized = ref(false); // Has initializeWebSocket been called?
// const _connectionStatus = ref<WSStatus>(WSStatus.CLOSED);

// const _lastError = ref<Event | null>(null);
// const _statsSubscriptionStarted = ref(false);
// // Use shallowRef for functions as they don't change internally often
// // waiter<T>(eventHandlerName: string, ...data: any[]): Promise<T | undefined>

// const _send = shallowRef<((identifier: string, ...data: any[]) => void) | null>(
//   null
// );
// const _onError = shallowRef<((error: string) => void) | null>(null);

// const _sendData = shallowRef<((data: MessageToServer) => boolean) | null>(null);
// // const _open = shallowRef<(() => void) | null>(null)
// const _openProxy = shallowRef<((data: any) => boolean) | null>(null);
// const _onChangeStatus = shallowRef<((status: WSStatus) => void) | null>(null);
// const _onRawMessageRecieved = shallowRef<((event: string) => void) | null>(
//   null
// );
// const _onCookieSet = shallowRef<((cookieString: string) => void) | null>(null);
// const _onCookieDelete = shallowRef<((cookieString: string) => void) | null>(
//   null
// );
// const _onMessageRecieved = shallowRef<((event: MessageEvent) => void) | null>(
//   null
// );
// const _close = shallowRef<((code?: number, reason?: string) => void) | null>(
//   null
// );

// // --- Internal Initialization Logic ---
// async function _setupConnection(
//   route: string,
//   userId: string,
//   _isNotificationMessage: (data: any) => boolean,
//   _isStatsUpdateMessage: (data: any) => boolean
// ) {
//   console.log(_connectionStatus.value);

//   const userStore = useUserStore();
//   if (_isInitialized.value) {
//     console.warn("WebSocket connection already initialized. Skipping.");
//     return;
//   }
//   if (!route) {
//     console.error("WebSocket URL must be provided for initialization.");
//     return;
//   }
//   // userStore.token = localStorage.getItem('WSS') || ''
//   console.log("Attempting to initialize WebSocket connection to:", route);
//   const notificationStore = useNotificationStore(); // Get store instance here

//   try {
//     _client = await connectTo(`ws://localhost:6589${route}`, (error) => {
//       console.log(error);
//       notificationStore.addNotification(error as string, "warning", 5000);
//     });
//     _client.send("SubscribeToStatsUpdates", userId, true);
//     _client.setMessageHandler("StatsUpdate", (data: StatsUpdate) => {
//       console.log(data.table);
//       switch (data.table) {
//         case "user":
//           // notificationStore.addNotification(`User ${data.data.username} has ${data.data.isOnline ? 'joined' : 'left'} the server`, 'info', 5000)
//           userStore.updateCurrentUser(data.data as UserStatsUpdateData);
//           break;
//         case "Profile":
//           // notificationStore.addNotification(`Server ${data.data.name} has ${data.data.isOnline ? 'joined' : 'left'} the server`, 'info', 5000)
//           userStore.updateCurrentUserProfile(
//             data.data as ProfileStatsUpdateData
//           );

//           break;
//         default:
//           break;
//       }
//     });
//     _client.setMessageHandler("Subscribed", () => {
//       _connectionStatus.value = WSStatus.OPEN;
//     });
//     _client.addEventListener("onStatusChange", (newStauts: WSStatus) => {
//       console.log(newStauts); //Enum
//     });
//     _client.addEventListener("onMessageRecieved", (msg) => {
//       console.log(msg);
//     });

//     _client.addEventListener("onRawMessageRecieved", (rawMsg) => {
//       console.log(rawMsg);
//     });
//     _client.addEventListener("onCookieSet", (cookie) => {
//       // console.log(cookie)
//     });
//     _client.addEventListener("onCookieDelete", (cookie) => {
//       // console.log(cookie)
//     });

//     // function onError(error: string) {
//     //   console.log(error)
//     //   notificationStore.addNotification(error, 'warning', 5000)
//     // }
//     _onError.value = (error: string) => {
//       console.log(error);
//       notificationStore.addNotification(error, "warning", 5000);
//     }; // --- Link shared state refs to the instance's reactive properties ---
//     // function _onChangeStatus(newStatus: WSStatus) {
//     _onChangeStatus.value = (newStatus: WSStatus) => {
//       console.log("WebSocket status changed:", newStatus);
//       _connectionStatus.value = newStatus;
//       if (newStatus === WSStatus.OPEN) {
//         notificationStore.addNotification(
//           "Connected to real-time updates.",
//           "success",
//           3000
//         );
//       }
//       if (
//         _sendData.value &&
//         newStatus === WSStatus.OPEN &&
//         _isInitialized.value === false &&
//         _statsSubscriptionStarted.value == false
//       ) {
//         setTimeout(async () => {
//           // _sendData.value!({
//           //   type: 'ping',
//           //   payload: {
//           //     model: 'User',
//           //   },
//           //   // properties: ["*"],
//           // })
//           console.log((await _client.waiter("GetConnectionId")) as number);
//         }, 1000);
//         _statsSubscriptionStarted.value = true;
//         _isInitialized.value = true;
//       }
//       if (newStatus === WSStatus.OPENING) {
//         _connectionStatus.value = WSStatus.OPENING; // Also set status here
//       }
//       if (newStatus === WSStatus.ERROR) {
//         _connectionStatus.value = WSStatus.OPENING; // Also set status here
//         _statsSubscriptionStarted.value = false;
//         _onError.value = () => {
//           return "error";
//         };
//       }
//       if (newStatus === WSStatus.CLOSED) {
//         console.log("WebSocket disconnected:");
//         _connectionStatus.value = WSStatus.CLOSED; // Also set status here
//         _statsSubscriptionStarted.value = false;
//         // if (!event.wasClean) {
//         notificationStore.addNotification(
//           "Lost real-time connection.",
//           "warning",
//           5000
//         );
//         // }
//       }
//     };
//   } catch (e: any) {
//     console.log(e);
//     notificationStore.addNotification(e.message, "warning", 5000);
//   }

//   // Assign control functions ONCE
//   _send.value = _client.send;
//   // _open.value = _client.
//   _close.value = _client.disconnect;

//   // --- Setup the single listener for incoming notification messages ---
//   // watch(_client.data, (newMessage) => {
//   _onCookieSet.value = (newMessage) => {
//     console.log(newMessage);
//   };
//   _onCookieDelete.value = (newMessage) => {
//     console.log(newMessage);
//   };
//   _onMessageRecieved.value = (newMessage) => {
//     console.log(newMessage);
//   };

//   _onRawMessageRecieved.value = (newMessage) => {
//     const userStore = useUserStore();
//     // console.log(_client)
//     // console.log(newMessage)
//     const queryClient = useQueryClient();

//     if (!newMessage) return;
//     // console.log('Shared WebSocket listener received:', newMessage);
//     try {
//       const parsedData =
//         typeof newMessage === "string" ? JSON.parse(newMessage) : newMessage;
//       // console.log(parsedData)
//       if (parsedData.message === "ping") {
//         const message = { message: "pong" };
//         if (_client === null) return false;
//         if (_client.status === WSStatus.OPEN) {
//           console.log(message);
//           _client.send(JSON.stringify(message));
//         }
//         return true;
//       }
//       if (parsedData.change_type === "balance_update") {
//         // console.log('gota  balance update')
//         // console.log(parsedData)
//         userStore.setUserGameStat("balance", parsedData.new_balance);
//         queryClient.setQueryData(["balance"], (oldBalance: any) => {
//           return oldBalance || parsedData.new_balance;
//         });
//       }
//       // const newMessage = JSON.parse(event.data)
//     } catch (e) {
//       console.log(
//         "Failed to parse WebSocket message or invalid format:",
//         e,
//         newMessage
//       );
//     }
//   };

//   _isInitialized.value = true;
//   console.log(_connectionStatus.value);
//   console.log("WebSocket initialization complete.");
// }

// _sendData.value = (data: any): boolean => {
//   if (_client === null) return false;
//   if (_client.status === WSStatus.OPEN) {
//     console.log(data);
//     _client.send(JSON.stringify(data));
//   }
//   return true;
// };
// _openProxy.value = (data: any): boolean => {
//   console.log(_client);
//   if (_client === null) return false;
//   console.log(_client.status);
//   if (_client.status === WSStatus.OPEN) {
//     _client.send(JSON.stringify({ type: "openProxy", payload: data.payload }));
//   }
//   return true;
// };

// // --- Exported Functions ---

// /**
//  * Initializes the shared WebSocket connection.
//  * Should be called ONCE during application setup (e.g., in App.vue).
//  *
//  * @param url The WebSocket server URL.
//  * @param isNotificationMessage Optional custom function to identify notification messages.
//  */
// export async function initializeWebSocket(
//   url: string,
//   userId: string,
//   isNotificationMessage: (data: any) => boolean = defaultIsNotificationMessage,
//   isStatsUpdateMessage: (data: any) => boolean = defaultIsStatsUpdateMessage
// ): Promise<void> {
//   await _setupConnection(
//     url,
//     userId,
//     isNotificationMessage,
//     isStatsUpdateMessage
//   );
// }

// /**
//  * Composable to access the shared WebSocket state and control functions.
//  * Does NOT create a new connection. Call initializeWebSocket() first.
//  *
//  * @returns Reactive state and control functions for the shared WebSocket connection.
//  */
// export function useCashflowSocket() {
//   // const { data: balance, refetch } = useQuery({
//   //   queryKey: ['balance'],
//   //   queryFn: () => Promise.resolve([]), // Initial empty data
//   //   staleTime: Infinity, // Prevent automatic refetching
//   // })

//   // Return readonly refs for status/error to prevent accidental modification
//   // Return the shallowRefs containing the control functions
//   return {
//     // balance,
//     // refetch,
//     // status: _client.status,
//     openProxy: _openProxy,
//     isInitialized: readonly(_isInitialized),
//     connectionStatus: readonly(_connectionStatus),
//     lastError: readonly(_lastError),
//     send: _send, // Ref containing the send function
//     // sendData: _sendData, // Ref containing the send function
//     // open: _open, // Ref containing the open function
//     close: _close, // Ref containing the close function
//   };
// }

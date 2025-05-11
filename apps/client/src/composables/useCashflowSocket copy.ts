// // apps/client/src/composables/useZilaWebsocket.ts
// import {
//   ref,
//   shallowRef,
//   onUnmounted,
//   readonly,
//   computed,
//   type Ref,
// } from "vue";
// import {
//   connectTo, // The factory function from your wsClient.ts
//   ZilaConnection,
//   WSStatus,
//   type WSMessage, // The interface for messages { identifier, message, callbackId }
//   type errorCallbackType, // The type for error callbacks (reason?: string) => void
//   // CloseCodes, // Optional import if you need to handle specific close codes
// } from "@/utils/wsClient"; // Adjust this path to your actual wsClient.ts file
// import { useAuthStore } from "@/stores/auth";

// // Type for the payload of a message (the 'message' field of WSMessage)
// export type ZilaMessagePayload = any[] | any | null;

// // Type for the callback when listening to specific identifiers in this composable
// export type ZilaComposableMessageCallback = (
//   payload: ZilaMessagePayload
// ) => void;

// // --- Singleton Management for ZilaConnection instances ---
// // Ensures one ZilaConnection per wsUrl across the app
// const connectionsMap = new Map<string, Ref<ZilaConnection | null>>();
// const statusMap = new Map<string, Ref<WSStatus>>();
// const errorMap = new Map<string, Ref<string | null>>();
// const activeInstancesMap = new Map<string, number>(); // Tracks how many composable instances use a URL
// // Stores listeners managed by this composable: Map<url, Map<identifier, Set<callback>>>
// const urlIdentifierListenersMap = new Map<
//   string,
//   Map<string, Set<ZilaComposableMessageCallback>>
// >();

// export function useCashflowSocket(
//   wsUrl: string,
//   clientId: string,
//   options?: {
//     autoReconnect?: boolean;
//     maxReconnectAttempts?: number;
//     reconnectInterval?: number;
//   }
// ) {
//   if (!clientId) {
//     clientId = `client-${Math.random().toString(36).substring(2, 15)}`;
//   }
//   console.log(
//     `useZilaWebsocket (${clientId}): Initializing with URL: ${wsUrl}`
//   );
//   // --- Initialize Singleton State if this is the first time for this wsUrl ---
//   if (!connectionsMap.has(clientId)) {
//     connectionsMap.set(clientId, shallowRef<ZilaConnection | null>(null));
//     statusMap.set(clientId, ref<WSStatus>(WSStatus.CLOSED)); // Initial status
//     errorMap.set(clientId, ref<string | null>(null));
//     activeInstancesMap.set(clientId, 0);
//     urlIdentifierListenersMap.set(
//       clientId,
//       new Map<string, Set<ZilaComposableMessageCallback>>()
//     );
//   }

//   // Increment active instances for this URL
//   activeInstancesMap.set(clientId, (activeInstancesMap.get(clientId) ?? 0) + 1);

//   // Get the shared reactive refs for this URL
//   const connection = connectionsMap.get(clientId)!;
//   const status = statusMap.get(clientId)! as Ref<WSStatus>;
//   const wsError = errorMap.get(clientId)!;
//   const identifierListeners = urlIdentifierListenersMap.get(clientId)!;

//   // --- Computed Properties for Convenience ---
//   const isConnected = computed(() => status.value === WSStatus.OPEN);
//   const isConnecting = computed(() => status.value === WSStatus.OPENING);
//   const isClosed = computed(
//     () => status.value === WSStatus.CLOSED || status.value === WSStatus.ERROR
//   ); // Consider ERROR as effectively closed for sending

//   // --- Internal Event Handlers (called by ZilaConnection's local events) ---

//   // Attached to ZilaConnection's 'onStatusChange' event
//   const _onZilaStatusChange = (newZilaStatus: WSStatus) => {
//     console.log(
//       `useZilaWebsocket (${clientId}): ZilaConnection reported status change -> ${WSStatus[newZilaStatus]}`
//     );
//     status.value = newZilaStatus; // Update our reactive ref
//     if (newZilaStatus === WSStatus.OPEN) {
//       wsError.value = null; // Clear errors on successful (re)connection
//     }
//     // If newZilaStatus is ERROR and wsError is not already set by _onZilaError, set a generic one.
//     else if (newZilaStatus === WSStatus.ERROR && !wsError.value) {
//       wsError.value = "ZilaConnection entered ERROR state.";
//     }
//   };

//   // Attached to ZilaConnection's 'onMessageRecieved' event
//   // The 'message' here is the full WSMessage object: { identifier, message, callbackId }
//   const _onZilaMessageRecieved = (wsMessage: WSMessage) => {
//     // console.log(`useZilaWebsocket (${wsUrl}): ZilaConnection received message. Identifier: ${wsMessage.identifier}`);
//     const callbacks = identifierListeners.get(wsMessage.identifier);
//     if (callbacks) {
//       callbacks.forEach((callback) => {
//         try {
//           // Pass the actual payload (the 'message' field of WSMessage) to the composable's listeners
//           callback(wsMessage.message);
//         } catch (e) {
//           console.error(
//             `useZilaWebsocket (${clientId}): Error in listener for identifier '${wsMessage.identifier}':`,
//             e
//           );
//         }
//       });
//     }
//   };

//   // This is the error callback passed to `connectTo` and potentially `setErrorHandler`
//   // It matches: (reason?: string) => void
//   const _onZilaError: errorCallbackType = (reason?: string) => {
//     const errorMessage =
//       reason || `Unknown error from ZilaConnection for ${clientId}`;
//     console.error(
//       `useZilaWebsocket (${clientId}): ZilaConnection error callback: ${errorMessage}`
//     );
//     wsError.value = errorMessage;
//     // ZilaConnection might also emit an 'onStatusChange' to ERROR.
//     // If not, ensure our reactive status reflects this error.
//     if (status.value !== WSStatus.ERROR) {
//       status.value = WSStatus.ERROR;
//     }
//   };

//   // --- Public API Methods Exposed by the Composable ---

//   /**
//    * Initiates or ensures the WebSocket connection.
//    */
//   async function connectWebSocket(): Promise<void> {
//     // Check our reactive status: if already OPEN or OPENING, do nothing.
//     if (
//       connection.value &&
//       (status.value === WSStatus.OPEN || status.value === WSStatus.OPENING)
//     ) {
//       console.log(
//         `useZilaWebsocket (${clientId}): Connection is already ${WSStatus[status.value]}.`
//       );
//       return;
//     }

//     status.value = WSStatus.OPENING; // Update our reactive status
//     wsError.value = null;
//     const authStore = useAuthStore();

//     // check that we have a token if not return
//     const token = authStore.getToken;
//     if (token === null) {
//       // console.error(
//       //   `useZilaWebsocket (${wsUrl}): No token found. Cannot connect.`
//       // );
//       status.value = WSStatus.ERROR;
//       wsError.value = "No token found. Cannot connect.";
//       return;
//     } else {
//       if (!wsUrl.includes("token")) {
//         wsUrl = `${wsUrl}?token=${token}`;
//       }
//     }

//     console.log(
//       `useZilaWebsocket (${clientId}) url (${wsUrl}): Initiating connection...`
//     );

//     try {
//       const newConnection = await connectTo(
//         wsUrl,
//         clientId,
//         _onZilaError, // Pass the error handler
//         options?.autoReconnect ?? false, // Pass through options
//         options?.maxReconnectAttempts ?? 5,
//         options?.reconnectInterval ?? 3000
//       );
//       console.log(newConnection);
//       console.log(connection.value);
//       if (newConnection) {
//         // If there was an old ZilaConnection instance for this URL (e.g., from a previous failed attempt that didn't clean up fully),
//         // ensure its listeners are removed before assigning the new one.
//         if (connection.value && connection.value !== newConnection) {
//           connection.value.removeEventListener(
//             "onStatusChange",
//             _onZilaStatusChange
//           );
//           connection.value.removeEventListener(
//             "onMessageRecieved",
//             _onZilaMessageRecieved
//           );
//         }
//         console.log(connection.value);
//         connection.value = newConnection; // Store the new ZilaConnection instance

//         // Attach our internal handlers to ZilaConnection's local events
//         connection.value.removeEventListener(
//           "onStatusChange",
//           _onZilaStatusChange
//         ); // Ensure no duplicates
//         connection.value.addEventListener(
//           "onStatusChange",
//           _onZilaStatusChange
//         );

//         connection.value.removeEventListener(
//           "onMessageRecieved",
//           _onZilaMessageRecieved
//         ); // Ensure no duplicates
//         connection.value.addEventListener(
//           "onMessageRecieved",
//           _onZilaMessageRecieved
//         );

//         // The status.value should be updated by _onZilaStatusChange once ZilaConnection connects.
//         // If connectTo resolves, ZilaConnection.connect() was called and it should be OPEN or an error occurred.
//         //@ts-ignore
//         if (status.value === WSStatus.OPEN) {
//           console.log(
//             `useZilaWebsocket (${wsUrl}): Connection established and reactive status is OPEN.`
//           );
//         } else {
//           console.warn(
//             `useZilaWebsocket (${wsUrl}): connectTo resolved, but reactive status is ${WSStatus[status.value]}. Error: ${wsError.value || "None"}`
//           );
//         }
//       } else {
//         // connectTo failed to return an instance (should have been caught by _onZilaError or the catch block)
//         console.error(
//           `useZilaWebsocket (${wsUrl}): connectTo returned null/undefined.`
//         );
//         if (status.value === WSStatus.OPENING) status.value = WSStatus.ERROR; // Ensure not stuck in OPENING
//         if (!wsError.value)
//           wsError.value =
//             "Failed to get ZilaConnection instance from connectTo.";
//       }
//     } catch (error: any) {
//       console.error(
//         `useZilaWebsocket (${wsUrl}): Exception during connectWebSocket call:`,
//         error
//       );
//       // _onZilaError should have been called by connectTo if it rejects, or we call it here.
//       if (!wsError.value) {
//         // If _onZilaError wasn't triggered from connectTo's rejection path
//         _onZilaError(
//           `Connection attempt failed: ${error.message || String(error)}`
//         );
//       }
//       if (connection.value) {
//         // Clean up potentially half-formed connection
//         connection.value.removeEventListener(
//           "onStatusChange",
//           _onZilaStatusChange
//         );
//         connection.value.removeEventListener(
//           "onMessageRecieved",
//           _onZilaMessageRecieved
//         );
//         connection.value = null;
//       }
//       // Status should be ERROR due to _onZilaError
//     }
//   }

//   /**
//    * Disconnects the WebSocket.
//    */
//   async function disconnectWebSocket(): Promise<void> {
//     if (connection.value) {
//       console.log(
//         `useZilaWebsocket (${wsUrl}): Disconnecting (Reactive Status: ${WSStatus[status.value]})...`
//       );
//       await connection.value.disconnectAsync(); // This should trigger 'onStatusChange'
//       // Clean up listeners on the ZilaConnection object
//       connection.value.removeEventListener(
//         "onStatusChange",
//         _onZilaStatusChange
//       );
//       connection.value.removeEventListener(
//         "onMessageRecieved",
//         _onZilaMessageRecieved
//       );
//       connection.value = null; // Clear our ref to the instance
//       // The status.value should be updated to CLOSED by _onZilaStatusChange.
//       // If not, as a fallback:
//       if (status.value !== WSStatus.CLOSED) {
//         console.warn(
//           `useZilaWebsocket (${wsUrl}): Reactive status not CLOSED after disconnect. Forcing.`
//         );
//         status.value = WSStatus.CLOSED;
//       }
//     } else {
//       // console.log(`useZilaWebsocket (${wsUrl}): Already disconnected or no instance to disconnect.`);
//       if (status.value !== WSStatus.CLOSED) status.value = WSStatus.CLOSED; // Ensure consistency
//     }
//   }

//   /**
//    * Registers a callback for messages with a specific identifier.
//    * @param identifier The message identifier to listen for.
//    * @param callback The function to call with the message payload.
//    * @returns An unsubscribe function.
//    */
//   function onMessage(
//     identifier: string,
//     callback: ZilaComposableMessageCallback
//   ): () => void {
//     if (!identifierListeners.has(identifier)) {
//       identifierListeners.set(identifier, new Set());
//     }
//     const callbacksSet = identifierListeners.get(identifier)!;
//     callbacksSet.add(callback);
//     // console.log(`useZilaWebsocket (${wsUrl}): Registered listener for '${identifier}'. Total: ${callbacksSet.size}`);

//     return () => {
//       const currentCallbacksSet = identifierListeners.get(identifier);
//       if (currentCallbacksSet) {
//         currentCallbacksSet.delete(callback);
//         // console.log(`useZilaWebsocket (${wsUrl}): Unregistered listener for '${identifier}'. Remaining: ${currentCallbacksSet.size}`);
//         if (currentCallbacksSet.size === 0) {
//           identifierListeners.delete(identifier);
//         }
//       }
//     };
//   }

//   /**
//    * Sends a fire-and-forget message to the server using ZilaConnection's postMessage.
//    * @param identifier The message identifier.
//    * @param payload The data to send (can be a single value or multiple arguments for ...payload).
//    */
//   async function postMessage(
//     identifier: string,
//     ...payload: any[]
//   ): Promise<void> {
//     if (connection.value && status.value === WSStatus.OPEN) {
//       // console.log(`useZilaWebsocket (${wsUrl}): Posting message '${identifier}' with payload:`, payload);
//       try {
//         await connection.value.postMessage(identifier, ...payload);
//       } catch (error: any) {
//         console.error(
//           `useZilaWebsocket (${wsUrl}): Error posting message '${identifier}':`,
//           error
//         );
//         _onZilaError(
//           `Failed to post message '${identifier}': ${error.message || String(error)}`
//         );
//         throw error; // Re-throw after handling
//       }
//     } else {
//       const errorMsg = `useZilaWebsocket (${wsUrl}): Cannot post message '${identifier}'. WebSocket not OPEN. Status: ${WSStatus[status.value]}`;
//       console.error(errorMsg);
//       return Promise.reject(new Error(errorMsg));
//     }
//   }

//   /**
//    * Sends a message and expects a response from the server using ZilaConnection's requestResponse.
//    * @param identifier The message identifier.
//    * @param payload The data to send.
//    * @param timeoutMs Timeout for the response.
//    */
//   async function requestResponse(
//     identifier: string,
//     payload: any[] | any,
//     timeoutMs?: number
//   ): Promise<any[]> {
//     if (connection.value && status.value === WSStatus.OPEN) {
//       // console.log(`useZilaWebsocket (${wsUrl}): Sending request-response '${identifier}' with payload:`, payload);
//       try {
//         return await connection.value.requestResponse(
//           identifier,
//           payload,
//           timeoutMs
//         );
//       } catch (error: any) {
//         console.error(
//           `useZilaWebsocket (${wsUrl}): Error in request-response for '${identifier}':`,
//           error
//         );
//         _onZilaError(
//           `Request-response failed for '${identifier}': ${error.message || String(error)}`
//         );
//         throw error; // Re-throw after handling
//       }
//     } else {
//       const errorMsg = `useZilaWebsocket (${wsUrl}): Cannot send request-response '${identifier}'. WebSocket not OPEN. Status: ${WSStatus[status.value]}`;
//       console.error(errorMsg);
//       return Promise.reject(new Error(errorMsg));
//     }
//   }

//   // --- Lifecycle Hook for Cleanup ---
//   onUnmounted(() => {
//     const currentActive = activeInstancesMap.get(wsUrl) ?? 0;
//     activeInstancesMap.set(wsUrl, Math.max(0, currentActive - 1));

//     if (activeInstancesMap.get(wsUrl) === 0) {
//       console.log(
//         `useZilaWebsocket (${wsUrl}): All instances unmounted. Cleaning up WebSocket connection and listeners.`
//       );
//       disconnectWebSocket(); // This will also nullify connection.value

//       // Clean up maps for this URL
//       connectionsMap.delete(wsUrl);
//       statusMap.delete(wsUrl);
//       errorMap.delete(wsUrl);
//       activeInstancesMap.delete(wsUrl);
//       urlIdentifierListenersMap.delete(wsUrl); // Clear listeners map for this URL
//     }
//   });

//   // --- Return Public API ---
//   return {
//     connectionStatus: readonly(status),
//     websocketError: readonly(wsError),
//     isConnected: readonly(isConnected),
//     isConnecting: readonly(isConnecting),
//     isClosed: readonly(isClosed),
//     connectWebSocket,
//     disconnectWebSocket,

//     onMessage, // Method to listen for specific server-pushed events
//     postMessage, // Method to send fire-and-forget messages
//     requestResponse, // Method to send messages expecting a response

//     // Optionally, expose the raw ZilaConnection for advanced cases, but with caution
//     // rawZilaConnection: readonly(connection) as Readonly<Ref<ZilaConnection | null>>,
//   };
// }

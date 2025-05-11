// // apps/client/src/composables/useBetterAuth.ts
// import { ref, onMounted, onUnmounted, computed, watch } from "vue";
// import { useAuthStore } from "../stores/auth";
// import { useUserStore, type UserData } from "../stores/user";
// import { useProfileStore, type ProfileData } from "../stores/profile";
// import { useCashflowSocket } from "./useCashflowSocket"; // Your existing wrapper
// import {
//   type ClientSession,
//   type ClientAuthUser,
//   type ApiAuthError,
//   type AuthCredentials,
//   type SignUpPayload,
//   // We'll use specific identifiers instead of a generic AuthWebSocketMessage type here for listening
// } from "@cashflow/types";
// import { createAuthClient } from "better-auth/vue";
// export const authClient = createAuthClient({
//   /** The base URL of the server (optional if you're using the same domain) */
//   baseURL: "http://localhost:6589",
// });
// // Define Auth WebSocket Event Identifiers (or import from @cashflow/types)
// const AUTH_EVENT_IDENTIFIERS = {
//   STATE_CHANGE: "auth:state_change",
//   USER_UPDATED: "auth:user_updated",
//   PROFILE_UPDATED: "auth:profile_updated",
// } as const;

// let composableInvocationCounter = 0;
// let activeComposableInstances = 0;

// const HONO_API_BASE_URL =
//   import.meta.env.VITE_HONO_API_BASE_URL || "http://localhost:8787/api";
// const HONO_WEBSOCKET_URL =
//   import.meta.env.VITE_HONO_WEBSOCKET_URL || "ws://localhost:8787/ws"; // Used by useZilaWebsocket

// export function useBetterAuth() {
//   composableInvocationCounter++;
//   const instanceId = composableInvocationCounter;

//   const authStore = useAuthStore();
//   const userStore = useUserStore();
//   const profileStore = useProfileStore();

//   const {
//     isConnected: isWebSocketConnected,
//     connectWebSocket, // Assuming this initiates connection if not already connected
//     disconnectWebSocket,
//     // IMPORTANT: Assuming useZilaWebsocket provides these methods for targeted listening and emitting
//     onMessage: onZilaMessage, // e.g., onMessage(identifier: string, callback: (payload: any) => void)
//     // sendWebSocketMessage: emitZilaMessage, // e.g., emitZilaMessage(identifier: string, data: any)
//     postMessage, // Corrected: use 'postMessage' or 'requestResponse'
//     requestResponse,
//     // Expose ZilaConnection status if available from useZilaWebsocket
//     // connectionStatus, // e.g., a ref<WSStatus> from useZilaWebsocket
//   } = useCashflowSocket(HONO_WEBSOCKET_URL); // `useZilaWebsocket` manages the ZilaConnection

//   const session = computed(() => authStore.session as ClientSession | null);
//   const isAuthenticated = computed(() => !!authStore.session?.user);
//   const isLoading = computed(() => authStore.isLoading); // Use Pinia store's loading
//   const authError = computed(() => authStore.error as ApiAuthError | null);
//   const currentUser = computed(() => userStore.currentUser);
//   const currentProfile = computed(() => profileStore.currentProfile);
//   const initialAuthCheckComplete = computed(
//     () => authStore.initialAuthCheckComplete
//   );

//   // Directly use store actions
//   const setLoading = (value: boolean) => authStore.setLoading(value);
//   const setError = (error: ApiAuthError | null) => authStore.setError(error);
//   const setInitialAuthCheckComplete = (value: boolean) =>
//     authStore.setInitialAuthCheckComplete(value);

//   async function fetchApi(
//     endpoint: string,
//     options: RequestInit = {}
//   ): Promise<any> {
//     // setLoading(true); // setLoading is now part of authStore
//     authStore.setLoading(true);
//     authStore.setError(null);
//     try {
//       const token = authStore.session?.token;
//       const headers = new Headers(options.headers || {});
//       if (token && !headers.has("Authorization")) {
//         headers.set("Authorization", `Bearer ${token}`);
//       }
//       if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
//         headers.set("Content-Type", "application/json");
//       }

//       const response = await fetch(`${HONO_API_BASE_URL}${endpoint}`, {
//         ...options,
//         headers,
//       });

//       if (!response.ok) {
//         let errorData: ApiAuthError;
//         try {
//           errorData = await response.json();
//           if (typeof errorData.message !== "string") {
//             errorData = {
//               message: response.statusText || "API Error",
//               code: response.status,
//             };
//           }
//         } catch (e) {
//           errorData = {
//             message: response.statusText || "API Error",
//             code: response.status,
//           };
//         }
//         authStore.setError(errorData);
//         console.error(
//           `API Error (${response.status}) on ${endpoint}:`,
//           errorData
//         );
//         throw errorData;
//       }
//       if (response.status === 204) return null;
//       return await response.json();
//     } catch (e: any) {
//       if (!e.message && !(e as ApiAuthError).code) {
//         // If not already an ApiAuthError
//         const err = {
//           message: e.toString() || "Network or unexpected error",
//         } as ApiAuthError;
//         authStore.setError(err);
//         throw err;
//       }
//       authStore.setError(e as ApiAuthError); // Assume e is already ApiAuthError if it has message/code
//       throw e;
//     } finally {
//       authStore.setLoading(false);
//     }
//   }

//   // Data fetching functions remain similar, using fetchApi
//   async function _createPublicUserAndProfile(/* ... */): Promise<{
//     userData: UserData | null;
//     profileData: ProfileData | null;
//     error: ApiAuthError | null;
//   }> {
//     // ... (implementation as before, but ensure it's still needed if server handles this on signup/OAuth)
//     // This function's relevance highly depends on your server-side implementation.
//     // Ideally, the server creates user and profile records atomically during signup/OAuth.
//     console.warn(
//       "useBetterAuth: _createPublicUserAndProfile called. Verify if server handles this."
//     );
//     return {
//       userData: null,
//       profileData: null,
//       error: {
//         message:
//           "_createPublicUserAndProfile not fully implemented or potentially obsolete.",
//       },
//     };
//   }

//   async function fetchPublicUserData(userId: string): Promise<UserData | null> {
//     if (!userId) return null;
//     try {
//       const userData = await fetchApi(`/users/${userId}`);
//       return userData as UserData;
//     } catch (e) {
//       return null;
//     }
//   }

//   async function fetchUserProfile(
//     userId: string,
//     activeProfileId?: string | null
//   ): Promise<ProfileData | null> {
//     if (!userId) return null;
//     let endpoint = activeProfileId
//       ? `/profiles/${activeProfileId}?userId=${userId}`
//       : `/users/${userId}/profile/active`;
//     try {
//       const profileData = await fetchApi(endpoint);
//       return profileData as ProfileData;
//     } catch (e) {
//       return null;
//     }
//   }

//   // --- WebSocket Auth Event Handlers ---
//   // Handler for AUTH_EVENT_IDENTIFIERS.STATE_CHANGE
//   async function handleAuthStateChange(sessionPayload: ClientSession | null) {
//     console.log(
//       `useBetterAuth: WebSocket event '${AUTH_EVENT_IDENTIFIERS.STATE_CHANGE}' received`,
//       sessionPayload
//     );
//     authStore.setLoading(true);
//     authStore.setSession(sessionPayload); // Update session in store

//     if (sessionPayload?.user) {
//       const userId = sessionPayload.user.id;
//       const publicUserData = await fetchPublicUserData(userId);
//       if (publicUserData) {
//         userStore.setUser(publicUserData);
//         const profileData = await fetchUserProfile(
//           userId,
//           publicUserData.activeProfileId
//         );
//         profileStore.setProfile(profileData);
//       } else {
//         console.warn(
//           `User data not found for authenticated user ${userId} after WebSocket auth state change.`
//         );
//         userStore.clearUser();
//         profileStore.clearProfile();
//         authStore.setError({
//           message: "User data inconsistent after auth state change.",
//         });
//       }
//     } else {
//       userStore.clearUser();
//       profileStore.clearProfile();
//     }
//     authStore.setInitialAuthCheckComplete(true);
//     authStore.setLoading(false);
//   }

//   // Handler for AUTH_EVENT_IDENTIFIERS.USER_UPDATED
//   async function handleUserUpdate(userPayload: Partial<ClientAuthUser>) {
//     // Or full ClientAuthUser
//     console.log(
//       `useBetterAuth: WebSocket event '${AUTH_EVENT_IDENTIFIERS.USER_UPDATED}' received`,
//       userPayload
//     );
//     if (
//       userPayload &&
//       userPayload.id &&
//       currentUser.value?.id === userPayload.id
//     ) {
//       authStore.setLoading(true);
//       // Option 1: Merge partial update (if payload is partial)
//       // userStore.setUser({ ...currentUser.value, ...userPayload });
//       // Option 2: Refetch for full consistency (safer)
//       const fullUserData = await fetchPublicUserData(userPayload.id);
//       if (fullUserData) userStore.setUser(fullUserData);
//       // Potentially update session.user as well if structure matches ClientAuthUser
//       if (
//         authStore.session?.user &&
//         authStore.session.user.id === userPayload.id &&
//         fullUserData
//       ) {
//         authStore.setSession({
//           ...authStore.session,
//           user: {
//             // Assuming fullUserData can be cast or mapped to ClientAuthUser
//             ...authStore.session.user,
//             username: fullUserData.username,
//             avatarUrl: fullUserData.avatar,
//             // map other relevant fields from UserData to ClientAuthUser
//           },
//         });
//       }
//       authStore.setLoading(false);
//     }
//   }

//   // Handler for AUTH_EVENT_IDENTIFIERS.PROFILE_UPDATED
//   async function handleProfileUpdate(profilePayload: Partial<ProfileData>) {
//     // Or full ProfileData
//     console.log(
//       `useBetterAuth: WebSocket event '${AUTH_EVENT_IDENTIFIERS.PROFILE_UPDATED}' received`,
//       profilePayload
//     );
//     if (
//       profilePayload &&
//       profilePayload.id &&
//       currentProfile.value?.id === profilePayload.id &&
//       currentUser.value?.id
//     ) {
//       authStore.setLoading(true);
//       const fullProfileData = await fetchUserProfile(
//         currentUser.value.id,
//         profilePayload.id as string
//       );
//       if (fullProfileData) profileStore.setProfile(fullProfileData);
//       authStore.setLoading(false);
//     }
//   }

//   // --- Auth Actions (using fetchApi) ---
//   async function signInWithPassword(credentials: AuthCredentials) {
//     try {
//       const sessionData = (await fetchApi("/auth/login", {
//         method: "POST",
//         body: JSON.stringify(credentials),
//       })) as ClientSession;
//       // const { data, error } = await authClient.signIn.email({
//       //   email: "test@example.com",
//       //   password: "password1234",
//       // });
//       console.log(sessionData.token);
//       authStore.setToken(sessionData.token as string);
//       authStore.setSession(sessionData); // Set session from HTTP first
//       // The server should then ideally push an AUTH_EVENT_IDENTIFIERS.STATE_CHANGE via WebSocket.
//       // If not, or for quicker update before WS message arrives (though it might cause a double update):
//       // await handleAuthStateChange(sessionData); // This might be redundant if server pushes reliably
//       // await connectWebSocket(); // Ensure WS is active
//       return { user: sessionData.user, session: sessionData, error: null };
//     } catch (e: any) {
//       return { user: null, session: null, error: e as ApiAuthError };
//     } finally {
//       setInitialAuthCheckComplete(true);
//     }
//   }

//   async function signUpNewUser(payload: SignUpPayload) {
//     try {
//       console.log("useBetterAuth: signUpNewUser called with payload:", payload);
//       const sessionData = (await fetchApi("/auth/register", {
//         method: "POST",
//         body: JSON.stringify(payload),
//       })) as ClientSession;
//       // const { data: sessionData, error } = await authClient.signUp.email({
//       //   email: payload.email,
//       //   password: payload.password,
//       //   name: payload.username,
//       //   image: "https://example.com/image.png",
//       // });
//       console.log(sessionData);
//       if (sessionData.user == null) return;
//       authStore.setSession(sessionData);
//       // Server should push AUTH_EVENT_IDENTIFIERS.STATE_CHANGE
//       // await connectWebSocket();
//       return { user: sessionData.user, session: sessionData, error: null };
//     } catch (e: any) {
//       return { user: null, session: null, error: e as ApiAuthError };
//     }
//   }

//   async function signInWithGoogleIdToken(idToken: string) {
//     try {
//       const sessionData = (await fetchApi("/auth/google", {
//         method: "POST",
//         body: JSON.stringify({ token: idToken }),
//       })) as ClientSession;
//       authStore.setSession(sessionData);
//       // Server should push AUTH_EVENT_IDENTIFIERS.STATE_CHANGE
//       await connectWebSocket();
//       return { user: sessionData.user, session: sessionData, error: null };
//     } catch (e: any) {
//       return { user: null, session: null, error: e as ApiAuthError };
//     } finally {
//       setInitialAuthCheckComplete(true);
//     }
//   }

//   async function signOut() {
//     try {
//       await fetchApi("/auth/logout", { method: "POST" });
//       // Local state is primarily cleared by the WebSocket AUTH_EVENT_IDENTIFIERS.STATE_CHANGE event from server.
//       // For immediate UI feedback and as a fallback:
//       authStore.setSession(null);
//       userStore.clearUser();
//       profileStore.clearProfile();
//       // disconnectWebSocket(); // Optional: disconnect WS on logout if desired
//       return { error: null };
//     } catch (e: any) {
//       authStore.setSession(null); // Still clear local state on error
//       userStore.clearUser();
//       profileStore.clearProfile();
//       return { error: e as ApiAuthError };
//     } finally {
//       setInitialAuthCheckComplete(true);
//     }
//   }

//   // --- Initialization and Lifecycle ---
//   const listenerUnsubscribeCallbacks: (() => void)[] = [];

//   async function initializeAuthSystem() {
//     activeComposableInstances++;
//     console.log(
//       `useBetterAuth (ID: ${instanceId}): Initializing (Active: ${activeComposableInstances})`
//     );

//     if (!authStore.initialAuthCheckComplete || !authStore.session?.user) {
//       authStore.setLoading(true);
//       try {
//         const currentSession = (await fetchApi("/auth/session", {
//           method: "GET",
//         })) as ClientSession | null;
//         // This will set the session. The WebSocket listener (if connected) should then receive
//         // an AUTH_EVENT_IDENTIFIERS.STATE_CHANGE from the server if the session is valid,
//         // which will then trigger data loading.
//         // Or, if server doesn't push on initial connect with session, handle it here:
//         if (currentSession?.user) {
//           // If server doesn't reliably push after HTTP session check + WS connect,
//           // call handleAuthStateChange manually. Otherwise, let WS event drive it.
//           await handleAuthStateChange(currentSession);
//         } else {
//           // If no session from HTTP, ensure local state is cleared.
//           await handleAuthStateChange(null);
//         }
//       } catch (e) {
//         console.log("useBetterAuth: No active HTTP session or error.", e);
//         await handleAuthStateChange(null); // Ensure state is cleared
//       } finally {
//         setInitialAuthCheckComplete(true); // HTTP check is done
//         authStore.setLoading(false);
//       }
//     }

//     // Ensure WebSocket connection and listeners are set up
//     // connectWebSocket should be idempotent or handle existing connections
//     await connectWebSocket();

//     if (activeComposableInstances === 1) {
//       // Only the first instance sets up shared listeners
//       console.log(
//         `useBetterAuth (ID: ${instanceId}): Setting up shared WebSocket listeners.`
//       );
//       // Clear any old listeners from previous hot reloads in dev
//       listenerUnsubscribeCallbacks.forEach((unsub) => unsub());
//       listenerUnsubscribeCallbacks.length = 0;

//       // Assuming onZilaMessage(identifier, callback) returns an unsubscribe function
//       const unsubAuthState = onZilaMessage(
//         AUTH_EVENT_IDENTIFIERS.STATE_CHANGE,
//         handleAuthStateChange
//       );
//       const unsubUserUpdate = onZilaMessage(
//         AUTH_EVENT_IDENTIFIERS.USER_UPDATED,
//         handleUserUpdate
//       );
//       const unsubProfileUpdate = onZilaMessage(
//         AUTH_EVENT_IDENTIFIERS.PROFILE_UPDATED,
//         handleProfileUpdate
//       );

//       if (unsubAuthState) listenerUnsubscribeCallbacks.push(unsubAuthState);
//       if (unsubUserUpdate) listenerUnsubscribeCallbacks.push(unsubUserUpdate);
//       if (unsubProfileUpdate)
//         listenerUnsubscribeCallbacks.push(unsubProfileUpdate);
//     }
//   }

//   onMounted(async () => {
//     console.log(`useBetterAuth (ID: ${instanceId}): Mounted.`);
//     await initializeAuthSystem();
//   });

//   onUnmounted(() => {
//     activeComposableInstances--;
//     console.log(
//       `useBetterAuth (ID: ${instanceId}): Unmounting (Active: ${activeComposableInstances})`
//     );
//     if (activeComposableInstances === 0) {
//       console.log(
//         `useBetterAuth (ID: ${instanceId}): All instances unmounted. Cleaning up shared listeners.`
//       );
//       listenerUnsubscribeCallbacks.forEach((unsub) => unsub());
//       listenerUnsubscribeCallbacks.length = 0;
//       // Optional: disconnectWebSocket(); // If WS should be closed when no auth composable is active
//     }
//   });

//   // Watch for WebSocket connection status changes from useZilaWebsocket
//   watch(isWebSocketConnected, (connected, previouslyConnected) => {
//     if (connected && !previouslyConnected) {
//       console.log(
//         "useBetterAuth: WebSocket reconnected. Attempting to re-sync auth state."
//       );
//       // Server might automatically send current auth state.
//       // If not, you might need to request it or re-run parts of initializeAuthSystem.
//       // For example, re-fetch HTTP session and let it flow.
//       if (!authStore.session?.user) {
//         // If we don't think we have a session, re-check
//         initializeAuthSystem();
//       } else {
//         // Or if server expects a specific "sync" message after reconnect:
//         // emitZilaMessage("auth:request_sync", {});
//       }
//     } else if (!connected && previouslyConnected) {
//       console.log("useBetterAuth: WebSocket disconnected.");
//       // setError({ message: "Realtime connection lost." }); // Inform user
//     }
//   });

//   return {
//     session,
//     isAuthenticated,
//     isLoading,
//     authError,
//     currentUser,
//     currentProfile,
//     initialAuthCheckComplete,
//     signInWithPassword,
//     signUpNewUser,
//     signInWithGoogleIdToken,
//     signOut,
//     fetchPublicUserData,
//     fetchUserProfile,
//     initializeAuthSystem, // For potential manual re-init
//     isWebSocketConnected, // Expose WS status from useZilaWebsocket
//   };
// }

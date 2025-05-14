// apps/client/src/stores/auth.ts
import { ref, computed } from "vue";
import { defineStore } from "pinia";
import {
  type ClientSession,
  type ApiAuthError,
  type AuthCredentials,
  type SignUpPayload,
  type User,
  type Profile,
  NETWORK_CONFIG,
  AuthenticatedState,
} from "@cashflow/types"; // Ensure these types are correctly imported from your @cashflow/types package
import { useNotificationStore } from "./notifications";
import { logToPage } from "@/utils/logger";
import type * as ApiTypes from "@cashflow/types";
import { UserData, useUserStore, useUserStoreOutside } from "./user";
import { ProfileData } from "./profile";
import { store } from "@/stores";
import { handleException } from "./exception";
import { Network } from "@/utils/Network";

export const useAuthStore = defineStore(
  "auth",
  () => {
    // --- State ---
    const sessionState = ref<ClientSession | null>(null);
    const success = ref(false);
    const loadingState = ref<boolean>(false);
    const isAuthenticated = ref<boolean>(false);
    const authenticated = ref<AuthenticatedState>({ loggedIn: false });
    const errorState = ref<ApiAuthError | null>(null);
    const initialAuthCheckCompleteState = ref<boolean>(false);
    const token = ref<string | null>(null);
    const userStore = useUserStoreOutside();
    // --- Getters (Computed properties) ---
    const session = computed(() => sessionState.value);
    // const isAuthenticated = computed(() => !!sessionState.value?.user);
    // const isAuthenticated = ref<boolean>(false);

    const isLoading = computed(() => loadingState.value);
    const error = computed(() => errorState.value);
    const getToken = computed(() => token.value);
    const initialAuthCheckComplete = computed(
      () => initialAuthCheckCompleteState.value
    );
    const getSuccess = computed(() => success.value);
    const setSuccess = (isSuccess: boolean) => {
      success.value = isSuccess;
    };
    function setAuthenticated(val: boolean) {
      authenticated.value = { loggedIn: val };
    }
    // --- Actions (Functions) ---
    function setSession(newSession: ClientSession | null) {
      sessionState.value = newSession;
    }

    function setToken(newToken: string | null) {
      token.value = newToken;
    }

    function setLoading(loading: boolean) {
      loadingState.value = loading;
    }

    function setError(newError: ApiAuthError | null) {
      const notificationStore = useNotificationStore();
      errorState.value = newError;
      if (newError !== null) {
        notificationStore.addNotification("error", newError.message);
      }
    }

    function setInitialAuthCheckComplete(complete: boolean) {
      initialAuthCheckCompleteState.value = complete;
    }

    function clearAuthError() {
      errorState.value = null;
    }

    // async function fetchPublicUserData(
    //   userId: string
    // ): Promise<Partial<User> | null> {
    const fetchPublicUserData = async (userId: string) => {
      if (!userId) {
        logToPage("warn", "fetchPublicUserData: No userId provided.");
        return null;
      }
      logToPage("debug", `Workspaceing public user data for ${userId}...`);
      // Adjust endpoint as per your Hono API structure
      const route: string = NETWORK_CONFIG.LOGIN.ME;
      const network: Network = Network.getInstance();
      // try {
      // const sessionData = (await fetchApi("/auth/login", {
      //   method: "POST",
      //   body: JSON.stringify(credentials),
      // })) as ClientSession | null;
      setSuccess(false);
      const next = (response: ApiTypes.GetSession) => {
        if (response.code === 200) {
          console.log(response.token);
          setSuccess(true);
          userStore.setUser(response.session as Partial<User>);
          logToPage("info", `User data fetched and set for ${userId}`);
          console.log(success.value);
          return response.session as Partial<User>;
        } else {
          setError({
            message: handleException(response.code),
            code: response.code,
          });
          return null;
        }
      };
      await network.sendMsg(route, undefined, next, 1);
      return userStore.getCurrentUser;
      // if (userData) {
      //   userStore.setUser(userData as Partial<User>); // Update store
      //   logToPage("info", `User data fetched and set for ${userId}`);
      // }
      // return userData as Partial<User> | null;
    };

    const fetchUserProfile = async (activeProfileId: string) => {
      if (!activeProfileId) {
        logToPage("warn", "fetchUserProfile: No userId provided.");
        return null;
      }
      logToPage("debug", `Workspaceing user profile from`);
      const route: string = NETWORK_CONFIG.LOGIN.LOGIN;
      const network: Network = Network.getInstance();
      // const sessionData = (await fetchApi("/auth/login", {
      //   method: "POST",
      //   body: JSON.stringify(credentials),
      // })) as ClientSession | null;
      setSuccess(false);
      const next = (response: ApiTypes.ProfileStatsUpdateData) => {
        if (response !== undefined) {
          userStore.setCurrentProfile(response as Partial<Profile>); // Update store
          logToPage(
            "info",
            `User profile fetched and set for ${activeProfileId}`
          );
          setSuccess(true);
          console.log(success.value);
          return response as Partial<Profile>;
        } else {
          setError({
            message: handleException(500),
            code: 500,
          });
          return null;
        }
      };
      await network.sendMsg(route, activeProfileId, next, 1);
      return userStore.getCurrentProfile;
    };

    // --- WebSocket Auth Event Handlers ---
    async function handleAuthStateChange(sessionPayload: ClientSession | null) {
      logToPage(
        "event",
        `Handling Auth State Change. New session user: ${sessionPayload?.user?.id || "None"}`
      );
      setLoading(true); // Indicate loading while processing state change
      setSession(sessionPayload);

      if (sessionPayload?.user) {
        const userId = sessionPayload.user.id;
        // It's often good to re-fetch user/profile data to ensure freshness,
        // even if some data is in sessionPayload.user.
        const publicUserData = await fetchPublicUserData(userId);
        if (publicUserData !== null && publicUserData.activeProfileId) {
          // User store is updated by fetchPublicUserData
          await fetchUserProfile(publicUserData.activeProfileId); // Profile store updated by fetchUserProfile
        } else {
          logToPage(
            "warn",
            `User data not found for authenticated user ${userId} after auth state change. Clearing local user/profile.`
          );
          userStore.clearUser();
          userStore.clearProfile();
          // Optionally, set an error or log out if essential data is missing post-auth
          // setError({ message: "User data inconsistent after authentication." });
          // await signOut(); // Drastic measure
        }
      } else {
        // No user in session (logged out or invalid session)
        userStore.clearUser();
        userStore.clearProfile();
        logToPage("info", "Session cleared, user and profile stores cleared.");
      }
      setInitialAuthCheckComplete(true); // Mark check complete after processing first significant auth event
      setLoading(false);
    }

    // async function handleUserUpdate(userPayload: Partial<ClientAuthUser>) {
    //   logToPage(
    //     "event",
    //     "Handling User Update event for user ID:",
    //     userPayload?.id
    //   );
    //   if (
    //     userPayload &&
    //     userPayload.id &&
    //     userStore.currentUser?.id === userPayload.id
    //   ) {
    //     setLoading(true);
    //     // Re-fetch for full consistency is safer than merging partials
    //     const fullUserData = await fetchPublicUserData(userPayload.id);
    //     if (fullUserData) {
    //       // userStore.setUser(fullUserData); // fetchPublicUserData already does this
    //       // If ClientAuthUser structure (in session) needs updating based on UserData
    //       if (
    //         session.value?.user &&
    //         session.value.user.id === fullUserData.id
    //       ) {
    //         setSession(
    //           session,
    //           // user: {
    //           //   // Map fields from UserData to ClientAuthUser as needed
    //           //   ...session.value.user, // Keep existing ClientAuthUser fields
    //           //   id: fullUserData.id, // from UserData
    //           //   email: fullUserData.email as string, // from UserData
    //           //   username: fullUserData.username, // from UserData
    //           //   avatarUrl: fullUserData.avatar, // from UserData
    //           //   // ... other fields from UserData that map to ClientAuthUser
    //           // },
    //         // }
    //       );
    //       }
    //     }
    //     setLoading(false);
    //   }
    // }

    // async function handleProfileUpdate(profilePayload: Partial<ProfileData>) {
    //   logToPage(
    //     "event",
    //     "Handling Profile Update event for profile ID:",
    //     profilePayload?.id
    //   );
    //   if (
    //     profilePayload &&
    //     profilePayload.id &&
    //     userStore.currentProfile?.id === profilePayload.id &&
    //     userStore.currentUser?.id
    //   ) {
    //     setLoading(true);
    //     // Re-fetch for full consistency
    //     await fetchUserProfile(profilePayload.id);
    //     // userStore.setProfile(fullProfileData); // fetchUserProfile already does this
    //     setLoading(false);
    //   }
    // }

    // // --- Auth Actions ---
    // async function commonPostAuthActions(
    //   sessionData: ClientSession | null,
    //   isInitialAuth: boolean = false
    // ) {
    //   const oldToken = session.value?.token;
    //   setSession(sessionData); // Update store immediately
    //   const newToken = sessionData?.token;

    //   // Re-establish WebSocket only if token status actually changes or if it's an initial auth process
    //   // if (newToken !== oldToken || isInitialAuth || !isWebSocketConnected.value) {
    //   //   logToPage(
    //   //     "debug",
    //   //     `Token status changed or initial auth. Old: ${oldToken ? "yes" : "no"}, New: ${newToken ? "yes" : "no"}. Re-establishing WS.`
    //   //   );
    //   //   await establishWebSocketConnection();
    //   // }

    //   // After setting session and potentially reconnecting WS, process the state
    //   // Server should push AUTH_STATE_CHANGE via WebSocket after successful login/logout/session update.
    //   // If immediate data update is critical and server push might be delayed, can call handleAuthStateChange.
    //   // However, relying on server push promotes a single source of truth for state updates.
    //   if (isInitialAuth && sessionData?.user) {
    //     // For initial load with a valid session
    //     await handleAuthStateChange(sessionData);
    //   } else if (!sessionData?.user && (oldToken || isInitialAuth)) {
    //     // For logout or initial load with no session
    //     await handleAuthStateChange(null);
    //   }
    //   // For login/signup, handleAuthStateChange will be triggered by the server's WebSocket push.
    // }

    async function signInWithPassword(credentials: AuthCredentials) {
      logToPage("info", `Attempting sign in for ${credentials.email}...`);
      const route: string = NETWORK_CONFIG.LOGIN.LOGIN;
      const network: Network = Network.getInstance();
      try {
        // const sessionData = (await fetchApi("/auth/login", {
        //   method: "POST",
        //   body: JSON.stringify(credentials),
        // })) as ClientSession | null;
        setSuccess(false);
        const next = (response: ClientSession) => {
          if (response.code === 200) {
            console.log(response.token);
            setToken(response.token);
            setSuccess(true);
            console.log(success.value);
            return {
              user: response?.user || null,
              session: response,
              error: null,
            };
          } else {
            setError({
              message: handleException(response.code),
              code: response.code,
            });
            return success.value;
          }
        };
        await network.sendMsg(route, credentials, next, 1);
        // await commonPostAuthActions(sessionData);
      } catch (e: any) {
        await commonPostAuthActions(null); // Ensure WS disconnects or connects without token
        return { user: null, session: null, error: e as ApiAuthError };
      } finally {
        setInitialAuthCheckComplete(true);
      }
    }

    async function signUpNewUser(credentials: SignUpPayload) {
      logToPage("info", `Attempting sign up for ${credentials.email}...`);
      try {
        // Assuming your /auth/register endpoint creates user, profile, and returns a session
        // const sessionData = (await fetchApi("/auth/register", {
        //   method: "POST",
        //   body: JSON.stringify(payload),
        // })) as ClientSession | null;
        const route: string = NETWORK_CONFIG.LOGIN.REGISTER;
        const network: Network = Network.getInstance();
        setSuccess(false);
        const next = (response: ClientSession) => {
          if (response.code !== 200) {
            console.log(response.token);
            setToken(response.token);
            setSuccess(true);
            console.log(success.value);
            return {
              user: response?.user || null,
              session: response,
              error: null,
            };
          } else {
            setError({
              message: handleException(response.code),
              code: response.code,
            });
            return success.value;
          }
        };
        await network.sendMsg(route, credentials, next, 1);
      } catch (e: any) {
        await commonPostAuthActions(null);
        return { user: null, session: null, error: e as ApiAuthError };
      }
    }

    async function signInWithGoogleIdToken(idToken: string) {
      const userStore = useUserStore();
      logToPage("info", "Attempting Google Sign In... ");
      try {
        const route: string = "/auth/google";
        const network: Network = Network.getInstance();
        setSuccess(false);
        const next = async (response: ClientSession) => {
          // console.log("next ", response);
          if (response.code === 200) {
            await userStore.dispatchUpdateCurrentUser();
            setToken(response.token);
            setSession(response);
            setAuthenticated(true);
            isAuthenticated.value = true;
            console.log(authenticated.value);
            setSuccess(true);

            return {
              user: response?.user || null,
              session: response,
              error: null,
            };
          } else {
            setError({
              message: handleException(response.code),
              code: response.code,
            });
            return success.value;
          }
        };
        await network.sendMsg(route, { token: idToken }, next, 1);
        return session;
      } catch (e: any) {
        await commonPostAuthActions(null);
        return { user: null, session: null, error: e as ApiAuthError };
      } finally {
        setInitialAuthCheckComplete(true);
      }
    }

    async function signOut() {
      logToPage("info", "Attempting sign out...");
      const currentToken = session.value?.token;
      try {
        // Pass token if your logout endpoint requires it for invalidation
        // await fetchApi("/auth/logout", { method: "POST" });
        const route: string = NETWORK_CONFIG.LOGIN.LOGOUT;
        const network: Network = Network.getInstance();
        setSuccess(false);
        const next = (response: ClientSession) => {
          if (response.code !== 200) {
            console.log(response.token);
            setToken(response.token);
            setSuccess(true);
            console.log(success.value);
            return {
              user: response?.user || null,
              session: response,
              error: null,
            };
          } else {
            setError({
              message: handleException(response.code),
              code: response.code,
            });
            return success.value;
          }
        };
        await network.sendMsg(route, undefined, next, 1);
      } catch (e: any) {
        logToPage(
          "error",
          "Sign out API call failed, but clearing local session anyway.",
          e
        );
        // Still proceed to clear local state and update WS
      } finally {
        await commonPostAuthActions(null); // Crucial: clear session, this triggers WS re-evaluation
        setInitialAuthCheckComplete(true);
      }
      return { error: error }; // Return any error that might have been set by fetchApi
    }
    function logout() {
      sessionState.value = null;
      errorState.value = null;
      // It's good practice to also reset related user/profile states here
      // import { useUserStore } from './user'; // Assuming you have these
      // import { useProfileStore } from './profile';
      // const userStore = useUserStore();
      // userStore.clearUser(); // Example action
      // const profileStore = useProfileStore();
      // userStore.clearProfile(); // Example action
    }

    return {
      // State (exposed as refs)
      sessionState,
      token,
      loadingState,
      errorState,
      initialAuthCheckCompleteState,
      signInWithGoogleIdToken,
      // Getters
      session,
      getToken,
      authenticated,
      isLoading,
      error,
      isAuthenticated,
      // Actions
      setToken,
      signInWithPassword,
      setSession,
      setLoading,
      setError,
      setInitialAuthCheckComplete,
      clearAuthError,

      logout,
      signOut,
      signUpNewUser,
      setAuthenticated,
    };
  },
  {
    // Configuration for pinia-plugin-persistedstate (if you use it)
    persist: true,
    // Persist the entire state by default.
    // You can customize which parts of the state to persist:
    // paths: ['sessionState', 'initialAuthCheckCompleteState'],
    // storage: localStorage, // or sessionStorage
  }
);
/**
 * @description In SPA applications, allows the store to be used before the Pinia instance becomes active.
 * @descriptionn SSR applications, allows the store to be used outside of a component'ssetup()context.
 */
export function useAuthStoreOutside() {
  return useAuthStore(store);
}

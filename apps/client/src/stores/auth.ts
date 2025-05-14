// apps/client/src/stores/auth.ts
import { ref, computed } from "vue";
import { defineStore } from "pinia";
import {
  type ClientSession,
  type ApiAuthError,
  type AuthCredentials,
  type SignUpPayload,
  NETWORK_CONFIG,
  type GetSession, // Assuming this is used for the /auth/session response
  type ProfileStatsUpdateData, // Assuming this might be returned sometimes
} from "@cashflow/types"; // Ensure these types are correctly imported
import { useNotificationStore } from "./notifications";
import { logToPage } from "@/utils/logger";
import { handleException } from "./exception";
import { Network } from "@/utils/Network";
import { useUserStore } from "./user"; // Import user store to trigger user data fetching

export const useAuthStore = defineStore(
  "auth",
  () => {
    // --- State ---
    // Use sessionState as the single source of truth for the current session data
    const sessionState = ref<ClientSession | null>(null);
    const loadingState = ref<boolean>(false);
    const errorState = ref<ApiAuthError | null>(null);
    // Tracks if the initial check (on app load) has completed
    const initialAuthCheckCompleteState = ref<boolean>(false);

    // --- Getters (Computed properties) ---
    const session = computed(() => sessionState.value);
    const isLoading = computed(() => loadingState.value);
    const error = computed(() => errorState.value);

    // Single source of truth for authentication status
    const isAuthenticated = computed(() => !!sessionState.value?.token);
    const initialAuthCheckComplete = computed(
      () => initialAuthCheckCompleteState.value
    );

    // --- Actions (Functions) ---

    // Helper to set the session state
    function setSession(newSession: ClientSession | null) {
      sessionState.value = newSession;
      // When session changes, clear any lingering auth error
      if (newSession !== null) {
        clearAuthError();
      }
    }

    function setLoading(loading: boolean) {
      loadingState.value = loading;
    }

    function setError(newError: ApiAuthError | null) {
      const notificationStore = useNotificationStore();
      errorState.value = newError;
      if (newError !== null) {
        logToPage("error", "Auth Error:", newError.message);
        // Optionally only show notification for certain errors
        notificationStore.addNotification("error", newError.message);
      }
    }

    function setInitialAuthCheckComplete(complete: boolean) {
      initialAuthCheckCompleteState.value = complete;
    }

    function clearAuthError() {
      errorState.value = null;
    }

    /**
     * @description Initializes the authentication state on app startup.
     * Checks for an existing session/token and fetches user data if found.
     */
    async function initializeAuth() {
      logToPage("info", "Initializing authentication...");
      setLoading(true);
      setInitialAuthCheckComplete(false);
      clearAuthError();

      // Assuming the token is persisted (e.g., in local storage or cookies)
      // Your current implementation seems to rely on sessionState being persisted by Pinia plugin
      // If using local storage/cookies directly, read it here
      // const token = readTokenFromStorage(); // Implement this utility if needed
      const initialSession = sessionState.value; // Check session from persisted state

      if (initialSession?.token) {
        logToPage(
          "debug",
          "Found existing token, attempting to validate session and fetch user data."
        );
        // Attempt to fetch/validate the session and get fresh user data
        try {
          // Use the Network class to call the session endpoint
          const network = Network.getInstance();
          const route: string = NETWORK_CONFIG.LOGIN.ME; // Or your session validation endpoint

          // Assuming the session endpoint returns user/profile data if token is valid
          const response = await network.sendMsg(
            route,
            undefined,
            (res: GetSession) => res,
            1
          );

          if (response?.code === 200 && response.session) {
            // Update session state with potentially fresh data from the server
            setSession(response.session);
            logToPage("info", "Session validated and state updated.");

            // *** User data fetching is now handled by userStore subscription ***
            // The userStore will react to sessionState.value being set and fetch user data
          } else {
            // Token was invalid or expired
            logToPage(
              "warn",
              "Existing token invalid or expired. Clearing session."
            );
            await signOut(false); // Clear session locally, don't call logout API again
          }
        } catch (e: any) {
          logToPage("error", "Error during initial session validation:", e);
          // Assume token is invalid on network error during validation
          await signOut(false); // Clear session locally
          setError({ message: "Failed to validate session.", code: 500 }); // Or a more specific error
        }
      } else {
        logToPage(
          "info",
          "No existing token found. User is not authenticated."
        );
        // Ensure session and user data are cleared if no token was found
        setSession(null);
        const userStore = useUserStore(); // Access user store to clear its state
        userStore.clearUser();
        userStore.clearProfile();
      }

      setInitialAuthCheckComplete(true);
      setLoading(false);
      logToPage("info", "Authentication initialization complete.");
    }

    async function signInWithPassword(credentials: AuthCredentials) {
      logToPage("info", `Attempting sign in for ${credentials.email}...`);
      setLoading(true);
      clearAuthError();
      try {
        const route: string = NETWORK_CONFIG.LOGIN.LOGIN;
        const network: Network = Network.getInstance();

        const response = await network.sendMsg(
          route,
          credentials,
          (res: ClientSession) => res,
          1
        );

        if (response?.code === 200 && response.session) {
          logToPage("info", "Sign in successful.");
          setSession(response.session);
          // The userStore subscription will automatically fetch user data now
          return { success: true, error: null };
        } else {
          const errorMessage = handleException(response?.code || 500);
          setError({
            message: errorMessage,
            code: response?.code || 500,
          });
          setSession(null); // Ensure session is null on failure
          logToPage("error", "Sign in failed:", errorMessage);
          return { success: false, error: errorState.value };
        }
      } catch (e: any) {
        logToPage("error", "Sign in network error:", e);
        setError({ message: "Network error during sign in.", code: 500 }); // Or refine error handling
        setSession(null); // Ensure session is null on network error
        return { success: false, error: errorState.value };
      } finally {
        setLoading(false);
      }
    }

    async function signUpNewUser(payload: SignUpPayload) {
      logToPage("info", `Attempting sign up for ${payload.email}...`);
      setLoading(true);
      clearAuthError();
      try {
        const route: string = NETWORK_CONFIG.LOGIN.REGISTER;
        const network: Network = Network.getInstance();

        // Assuming register endpoint also logs in the user and returns a session
        const response = await network.sendMsg(
          route,
          payload,
          (res: ClientSession) => res,
          1
        );

        if (response?.code === 200 && response.session) {
          logToPage("info", "Sign up successful and user logged in.");
          setSession(response.session);
          // The userStore subscription will automatically fetch user data now
          return { success: true, error: null };
        } else {
          const errorMessage = handleException(response?.code || 500);
          setError({
            message: errorMessage,
            code: response?.code || 500,
          });
          setSession(null); // Ensure session is null on failure
          logToPage("error", "Sign up failed:", errorMessage);
          return { success: false, error: errorState.value };
        }
      } catch (e: any) {
        logToPage("error", "Sign up network error:", e);
        setError({ message: "Network error during sign up.", code: 500 }); // Or refine error handling
        setSession(null); // Ensure session is null on network error
        return { success: false, error: errorState.value };
      } finally {
        setLoading(false);
      }
    }

    async function signInWithGoogleIdToken(idToken: string) {
      logToPage("info", "Attempting Google Sign In...");
      setLoading(true);
      clearAuthError();
      try {
        const route: string = "/auth/google"; // Adjust if your Google auth endpoint is different
        const network: Network = Network.getInstance();

        const response = await network.sendMsg(
          route,
          { token: idToken },
          (res: ClientSession) => res,
          1
        );

        if (response?.code === 200 && response.session) {
          logToPage("info", "Google Sign In successful.");
          setSession(response.session);
          // The userStore subscription will automatically fetch user data now
          return { success: true, error: null };
        } else {
          const errorMessage = handleException(response?.code || 500);
          setError({
            message: errorMessage,
            code: response?.code || 500,
          });
          setSession(null); // Ensure session is null on failure
          logToPage("error", "Google Sign In failed:", errorMessage);
          return { success: false, error: errorState.value };
        }
      } catch (e: any) {
        logToPage("error", "Google Sign In network error:", e);
        setError({
          message: "Network error during Google Sign In.",
          code: 500,
        }); // Or refine error handling
        setSession(null); // Ensure session is null on network error
        return { success: false, error: errorState.value };
      } finally {
        setLoading(false);
        // Note: initialAuthCheckComplete is set in initializeAuth on app load,
        // Login/Signup success doesn't reset this flag.
      }
    }

    /**
     * @description Signs out the user. Optionally calls the logout API.
     * @param callApi - Whether to call the server's logout endpoint. Defaults to true.
     */
    async function signOut(callApi: boolean = true) {
      logToPage("info", "Attempting sign out...");
      setLoading(true); // Maybe a separate logout loading state is useful?
      clearAuthError(); // Clear any previous errors on sign out attempt

      if (callApi) {
        try {
          const route: string = NETWORK_CONFIG.LOGIN.LOGOUT;
          const network: Network = Network.getInstance();
          // Assuming logout is a POST request, potentially with token in headers (handled by Network)
          const response = await network.sendMsg(
            route,
            undefined,
            (res: any) => res,
            1
          );

          if (response?.code === 200) {
            logToPage("info", "Server logout successful.");
          } else {
            // Log server-side logout error, but proceed with client-side clear
            logToPage("warn", "Server logout failed:", response?.code);
            setError({
              message: handleException(response?.code || 500),
              code: response?.code || 500,
            });
          }
        } catch (e: any) {
          logToPage("error", "Sign out network error:", e);
          setError({ message: "Network error during sign out.", code: 500 }); // Or refine
        }
      }

      // Always clear client-side state regardless of API call success/failure
      setSession(null); // This will trigger userStore to clear its state via subscription
      // Clear token from storage if not handled by setSession/persistence plugin
      // removeTokenFromStorage(); // Implement this utility if needed

      setLoading(false);
      logToPage("info", "Client-side sign out complete.");

      // Redirecting after logout is handled by App.vue watcher or navigation guard
    }

    // Return state, getters, and actions
    return {
      // State (exposed as refs for use with storeToRefs)
      sessionState,
      loadingState,
      errorState,
      initialAuthCheckCompleteState,

      // Getters (computed properties)
      session, // Provides the full session object reactively
      isLoading,
      error,
      isAuthenticated, // Primary auth status indicator
      initialAuthCheckComplete, // Primary initial check indicator

      // Actions
      initializeAuth, // New action for app bootstrap
      signInWithPassword,
      signUpNewUser,
      signInWithGoogleIdToken,
      signOut,
      clearAuthError,

      // Internal setters (only expose if strictly necessary for external use,
      // prefer actions for state changes)
      // setSession, // Keep private, managed by actions
      // setLoading, // Keep private, managed by actions
      // setError, // Keep private, managed by actions
      setInitialAuthCheckComplete, // Might be needed if another part of the app confirms initialization externally? Review usage.
    };
  },
  {
    // Pinia persistence configuration (if used)
    persist: {
      paths: ["sessionState"], // Only persist the session data
      storage: localStorage, // or sessionStorage, choose based on requirements
    },
  }
);

// Removed useAuthStoreOutside as it encourages bypassing Pinia's provide/inject,
// which is generally not needed in typical Vue 3 + Pinia applications.
// If you strictly need to access the store outside setup(), ensure Pinia is installed
// and imported correctly before use. If using in a router guard or similar,
// you can import and use it directly after Pinia initialization in main.ts.

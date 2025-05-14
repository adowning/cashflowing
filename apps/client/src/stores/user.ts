// apps/client/src/stores/user.ts
import { ref, computed } from "vue";
import { defineStore, storeToRefs } from "pinia"; // Import storeToRefs
import { handleException } from "./exception";
import { NETWORK_CONFIG } from "@cashflow/types";
import type {
  GetUserInfoResponseData, // Assuming this is the response type for fetching user/profile
  Profile,
  User,
  // Import other relevant types if needed for other state/actions
  // ProfileStatsUpdateData,
  // Transaction,
  // GetUserBalance,
  // GetUserBalanceResponseData,
  // UserStatsUpdateData,
} from "@cashflow/types";
import { Network } from "@/utils/Network";
import { logToPage } from "@/utils/logger";
import { useAuthStore } from "./auth"; // Import auth store

// Removed expScale as it doesn't seem directly related to user/profile data fetching/clearing

export const useUserStore = defineStore(
  "user",
  () => {
    // --- State ---
    const currentUser = ref<Partial<User> | null>(null);
    const currentProfile = ref<Partial<Profile> | null>(null);
    // Keep other user-specific states if necessary (balance, transactions, etc.)
    // const transactions = ref<Transaction[]>([]);
    // const currentUserBalance = ref(0);
    // const xpEarned = ref(0);
    // const totalXp = ref(0);
    // const roles = ref<string[]>([]);
    // const userBalance = ref<GetUserBalance>();

    // Keep success/error state specific to user data operations if needed,
    // but avoid duplicating auth error state.
    const loadingState = ref<boolean>(false);
    const errorState = ref<string | null>(null); // User data specific error message

    // --- Getters ---
    const getCurrentUser = computed(() => currentUser.value);
    const getCurrentProfile = computed(() => currentProfile.value);
    const isLoading = computed(() => loadingState.value);
    const error = computed(() => errorState.value);
    // const getUserBalance = computed(() => userBalance.value); // Example getter

    // --- Actions ---
    function setUser(userData: Partial<User> | null) {
      currentUser.value = userData;
    }

    function setCurrentProfile(profileData: Partial<Profile> | null) {
      currentProfile.value = profileData;
    }

    function clearUser() {
      currentUser.value = null;
      // Also clear other user-specific states
      // currentUserBalance.value = 0;
      // xpEarned.value = 0;
      // totalXp.value = 0;
      // roles.value = [];
      // transactions.value = [];
      // userBalance.value = undefined;
    }

    function clearProfile() {
      currentProfile.value = null;
    }

    function setLoading(loading: boolean) {
      loadingState.value = loading;
    }

    function setError(message: string | null) {
      errorState.value = message;
      if (message) {
        logToPage("error", "User Store Error:", message);
        // Optionally use notification store here if needed for user data errors
        // const notificationStore = useNotificationStore();
        // notificationStore.addNotification("error", message);
      }
    }

    /**
     * @description Fetches the authenticated user's data from the server.
     * Should be called after successful authentication.
     */
    async function fetchUserData() {
      logToPage("info", "Attempting to fetch user and profile data...");
      setLoading(true);
      setError(null);
      const authStore = useAuthStore(); // Access auth store

      // Ensure we have a token before attempting to fetch user data
      const token = authStore.session?.token;
      if (!token) {
        logToPage(
          "warn",
          "fetchUserData called without a token. Clearing user data."
        );
        clearUser();
        clearProfile();
        setLoading(false);
        return;
      }

      try {
        const route: string = NETWORK_CONFIG.LOGIN.ME; // Assuming this endpoint provides user and profile
        const network: Network = Network.getInstance();

        // The Network class should handle adding the Authorization header with the token
        const response = await network.sendMsg(
          route,
          undefined,
          (res: GetUserInfoResponseData) => res,
          1
        );

        if (response?.code === 200 && response.user && response.profile) {
          logToPage("info", "User and profile data fetched successfully.");
          setUser(response.user);
          setCurrentProfile(response.profile);
          // Update other user-specific states from the response if provided
          // userBalance.value = { data: { balance: response.user.balance } }; // Example
        } else {
          const errorMessage = handleException(response?.code || 500);
          setError(`Failed to fetch user data: ${errorMessage}`);
          logToPage(
            "error",
            `Failed to fetch user data (Code: ${response?.code || "N/A"})`
          );
          // If fetching user data fails after auth, it might indicate a problem.
          // Consider signing out or showing a persistent error.
          // authStore.signOut(false); // Optionally sign out if user data is critical
        }
      } catch (e: any) {
        logToPage("error", "Network error fetching user data:", e);
        setError("Network error while fetching user data.");
        // Consider signing out or showing a persistent error on network error
        // authStore.signOut(false); // Optionally sign out
      } finally {
        setLoading(false);
      }
    }

    // Removed direct dispatch actions that belong in Auth store or are triggered by subscription
    // dispatchSetUserCurrency, dispatchUserBalance, dispatchUserCashtag, dispatchSignout

    // --- Subscriptions ---
    // Subscribe to changes in the auth store's isAuthenticated state
    const authStore = useAuthStore(); // Access auth store
    // Use $subscribe to react to store state changes
    authStore.$subscribe((mutation, state) => {
      // We only care about changes originating from the auth store
      if (mutation.storeId === "auth") {
        const isAuthenticated = state.sessionState?.token; // Check the raw state or use state.isAuthenticated if exposed

        if (isAuthenticated) {
          logToPage(
            "debug",
            "User store reacting to authStateChange: Authenticated. Fetching user data..."
          );
          // When authenticated, fetch user data
          fetchUserData();
        } else {
          logToPage(
            "debug",
            "User store reacting to authStateChange: Unauthenticated. Clearing user data..."
          );
          // When unauthenticated, clear user data
          clearUser();
          clearProfile();
          setError(null); // Clear user-specific errors on logout
        }
      }
    });

    // Return state, getters, and actions
    return {
      // State (exposed as refs for use with storeToRefs)
      currentUser,
      currentProfile,
      loadingState,
      errorState,
      // Expose other user-specific states here...

      // Getters (computed properties)
      getCurrentUser,
      getCurrentProfile,
      isLoading, // Loading state for user data fetching
      error, // Error state for user data fetching
      // Expose other user-specific getters here...

      // Actions (for updating user data if not covered by fetchUserData)
      setUser, // Useful if user data can be updated by other means (e.g., profile edit form)
      setCurrentProfile, // Useful for profile updates
      clearUser, // Explicit action to clear user data
      clearProfile, // Explicit action to clear profile data
      // fetchUserData, // Keep internal, triggered by auth store subscription
      // Keep other user-specific update actions here if needed (e.g., updateBalance, updateSettings)
      // updateCurrentUserProfile, // Example
      // updateCurrentUser, // Example
    };
  },
  {
    // Pinia persistence configuration (if used)
    persist: {
      paths: ["currentUser", "currentProfile"], // Persist user/profile data
      storage: localStorage,
    },
  }
);

// Removed useUserStoreOutside

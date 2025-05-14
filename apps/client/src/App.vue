<template>
  <div id="app" class="roxdisplay">
    <GlobalLoading v-if="!initialAuthCheckComplete" />

    <div v-else>
      <div v-if="isAuthenticated && currentUser">
        <DesktopSection v-if="!isMobile">
          <RouterView />
        </DesktopSection>
        <MobileSection v-if="isMobile">
          <GlobalLoading v-if="globalStore.isLoading"></GlobalLoading>
          <RouterView v-else />
        </MobileSection>
      </div>

      <div v-else>
        <DesktopSection v-if="!isMobile">
          <LoginView />
        </DesktopSection>
        <MobileSection v-if="isMobile">
          <GlobalLoading v-if="globalStore.isLoading"></GlobalLoading>
          <LoginView v-else />
        </MobileSection>
      </div>

      <div v-if="authStore.error" class="error-message">
        <p>Authentication Error: {{ authStore.error.message }}</p>
      </div>
      <div v-if="userStore.error" class="error-message">
        <p>User Data Error: {{ userStore.error }}</p>
      </div>
    </div>
  </div>
  <OverlayLayer
    v-if="depositStore.shopOpen"
    :model-value="depositStore.shopOpen"
  >
    <ShopView v-if="depositStore.shopOpen" />
  </OverlayLayer>
</template>

<script setup lang="ts">
  import { onMounted, computed } from "vue"; // Import necessary Vue 3 APIs
  import { storeToRefs } from "pinia"; // Import storeToRefs

  import { useGlobalStore } from "./stores/global";
  import { useAuthStore } from "./stores/auth";
  import { useUserStore } from "./stores/user";
  // Import other stores used by components *rendered within* RouterView, but not directly in App.vue's logic
  // import { useVipStore } from "./stores/vip";
  // import { useGameStore } from "./stores/game";
  import { useDepositStore } from "./stores/deposit";
  // Assuming useDisplay is a composable that provides isMobile
  import { useDisplay } from "./composables/useDisplay";

  import LoginView from "./views/LoginView.vue";
  // Assuming these are components you have
  // import DesktopSection from './components/layouts/DesktopSection.vue';
  // import MobileSection from './components/layouts/MobileSection.vue';
  // import GlobalLoading from './components/GlobalLoading.vue';
  // import OverlayLayer from './components/OverlayLayer.vue';
  // import ShopView from './views/ShopView.vue';

  // Import external utilities/libraries if needed
  import { loadingFadeOut } from "virtual:app-loading"; // Assuming this utility exists
  import { useVipStore } from "./stores/vip";
  import { useGameStore } from "./stores/game";
  // WebSocketService connection will be handled by socket store subscribing to auth state

  // --- Stores ---
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const globalStore = useGlobalStore();
  const depositStore = useDepositStore();
  const { isMobile } = useDisplay();

  // --- State & Getters from Stores (using storeToRefs for reactivity) ---
  const {
    isAuthenticated, // Computed property from authStore (single source of truth)
    initialAuthCheckComplete, // State from authStore
    // isLoading: authLoading, // If you need to show auth-specific loading in App.vue
    // error: authError, // Auth store errors
  } = storeToRefs(authStore);

  const {
    currentUser, // State from userStore
    // isLoading: userLoading, // If you need to show user-specific loading in App.vue
    // error: userError, // User store errors
  } = storeToRefs(userStore);

  const {
    isLoading: globalLoading, // Global loading state
  } = storeToRefs(globalStore);

  // --- Initial App Bootstrap ---
  onMounted(async () => {
    console.log("App mounted, calling initializeAuth...");
    // Trigger the initial authentication check and setup
    await authStore.initializeAuth();

    // Hide the initial loading screen provided by vite-plugin-vue-startup-loading
    // This should happen regardless of auth success or failure, once the check is complete
    loadingFadeOut();

    // Other initial app setup that doesn't depend on user data can go here
  });

  // --- Optional: Watch for authentication state changes for side effects like navigation ---
  // This is ONE place to handle navigation after login/logout
  // Alternatively, use Vue Router Navigation Guards (recommended for cleaner routing logic)

  watch(
    isAuthenticated,
    (isNowAuthenticated) => {
      console.log(
        "App.vue reacting to isAuthenticated change:",
        isNowAuthenticated
      );
      const router = useRouter(); // Access router if needed
      if (isNowAuthenticated) {
        // User just became authenticated
        // Redirect to home or intended page if they are currently on login page
        if (router.currentRoute.value.path === "/login") {
          // Check current route
          router.push({ name: "Home" }); // Assuming 'Home' is your main app route
        }
      } else {
        // User just became unauthenticated (logged out)
        // Redirect to login page if they are currently on a protected route
        // You would need to define 'requiresAuth' meta fields in your router config
        if (router.currentRoute.value.meta.requiresAuth) {
          router.push({ name: "Login" }); // Assuming 'Login' is your login route
        }
      }
    },
    { immediate: true }
  ); // Run immediately on mount to handle initial route

  // You can keep fetching initial data for the main app here if it depends on authentication
  // This could also be done in a component's onMounted or a route guard

  watch(
    currentUser,
    (user) => {
      if (user) {
        console.log("User data loaded, fetching other initial data...");
        const vipStore = useVipStore();
        const gameStore = useGameStore();
        vipStore.dispatchVipInfo();
        gameStore.dispatchGameBigWin();
        gameStore.dispatchGameSearch("");
      }
    },
    { immediate: true }
  ); // Run immediately to handle initial user load
</script>
<style>
  /* Global styles */
  #app {
    /* styles */
  }

  .error-message {
    /* styles for error messages */
  }
</style>

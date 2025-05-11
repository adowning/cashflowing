<template>
  <div id="app">
    <div v-if="initialAuthCheckComplete && globalStore.isLoading">
      <GlobalLoading />
    </div>
    <div v-if="initialAuthCheckComplete">
      <div v-if="isAuthenticated && currentUser">
        <DesktopSection v-if="!isMobile">
          <RouterView />
        </DesktopSection>
        <MobileSection v-if="isMobile">
          <GlobalLoading v-if="globalStore.isLoading"></GlobalLoading>
          <RouterView v-else />
        </MobileSection>
      </div>
      <div v-else-if="!globalStore.isLoading">
        <DesktopSection v-if="!isMobile">
          <LoginView />
        </DesktopSection>
        <MobileSection v-if="isMobile">
          <GlobalLoading v-if="globalStore.isLoading"></GlobalLoading>
          <LoginView v-else />
        </MobileSection>
      </div>
      <div v-if="errorState" class="error-message">
        <p>Error: {{ errorState.message }}</p>
      </div>
      <!-- <div
        v-if="globalStore.isLoading && !initializeAuthSystem"
        class="loading-message"
      >
        <p>Processing...</p>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  // import { useBetterAuth } from "@/composables/useBetterAuth"; // Adjust path
  import { useGlobalStore } from "./stores/global";
  import LoginView from "./views/LoginView.vue";
  import { loadingFadeOut } from "virtual:app-loading";
  // import { getToken } from "./utils/auth";
  import { WebSocketService } from "./utils/websocket";
  import { useAuthStore } from "./stores/auth";
  import { useUserStore } from "./stores/user";

  const globalStore = useGlobalStore();
  const {
    authenticated,
    isLoading,
    errorState,
    initialAuthCheckComplete,
    getToken,
    // initializeAuthSystem,
    // isWebSocketConnected,
  } = useAuthStore();
  const { currentUser } = useUserStore();

  const { isMobile } = useDisplay();

  const signInForm = ref({ email: "", password: "" });
  const isAuthenticated = computed(() => authenticated.loggedIn);
  onMounted(() => {
    // subscribeGlobalAuth()
    const token = getToken;
    if (token) {
      WebSocketService.getInstance().connect();
    }
    // console.log('App.vue mounted, useSupabaseAuth is active.')
    loadingFadeOut();
    // isLoading = false
  });
</script>
<style></style>

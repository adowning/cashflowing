<template>
  <div id="app" class="roxdisplay">
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
    <GlobalLoading v-else />
  </div>
</template>

<script setup lang="ts">
  import { useGlobalStore } from "./stores/global";
  import LoginView from "./views/LoginView.vue";
  import { loadingFadeOut } from "virtual:app-loading";
  import { WebSocketService } from "./utils/websocket";
  import { useAuthStore } from "./stores/auth";
  import { useUserStore } from "./stores/user";
  import { useVipStore } from "./stores/vip";
  import { useGameStore } from "./stores/game";

  const globalStore = useGlobalStore();
  const { dispatchGameSearch, dispatchGameBigWin } = useGameStore();

  const {
    authenticated,
    errorState,
    initialAuthCheckComplete,
    setInitialAuthCheckComplete,
    getToken,
  } = useAuthStore();
  const { currentUser, dispatchUpdateCurrentUser } = useUserStore();
  const { isMobile } = useDisplay();
  const isAuthenticated = computed(() => authenticated.loggedIn);

  const { dispatchVipInfo } = useVipStore();

  onMounted(async () => {
    const token = getToken;
    if (token) {
      WebSocketService.getInstance().connect();
      await dispatchUpdateCurrentUser();
      await dispatchVipInfo();
      await dispatchGameBigWin();
      await dispatchGameSearch("");
      setInitialAuthCheckComplete(true);
    } else {
      setInitialAuthCheckComplete(true);
    }
    loadingFadeOut();
  });
</script>
<style></style>

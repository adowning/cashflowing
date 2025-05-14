<template>
  <div id="app" class="roxdisplay">
    <div v-if="initialAuthCheckCompleteState && globalStore.isLoading">
      <GlobalLoading />
    </div>
    <div v-if="initialAuthCheckCompleteState">
      <div v-if="authenticated.loggedIn && currentUser">
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
  <OverlayLayer
    v-if="depositStore.shopOpen"
    :model-value="depositStore.shopOpen"
  >
    <ShopView v-if="depositStore.shopOpen" />
  </OverlayLayer>
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
  import { useDepositStore } from "./stores/deposit";
  // import { router } from "./router";

  const globalStore = useGlobalStore();
  const { dispatchGameSearch, dispatchGameBigWin } = useGameStore();
  const {
    authenticated,
    errorState,
    initialAuthCheckCompleteState,
    setInitialAuthCheckComplete,
    getToken,
    setAuthenticated,
    setToken,
    isAuthenticated,
    error: aerror,
  } = useAuthStore();
  const {
    currentUser,
    dispatchUpdateCurrentUser,
    errMessage: uerror,
  } = useUserStore();
  const { isMobile } = useDisplay();
  // const isAuthenticated = ref(authenticated.loggedIn);

  // const isAuthenticated = computed(() => authenticated.loggedIn);

  const { dispatchVipInfo } = useVipStore();
  const { finishLoading } = useGlobalStore();
  const depositStore = useDepositStore();
  const isAuthenticated2 = computed(() => authenticated.loggedIn);
  watch(
    authenticated,
    (newAuthenticated) => {
      // User has successfully authenticated (either via form or Google)
      console.log("User authenticated, current user:", currentUser);
      // notificationStore.addNotification(
      //   "info",
      //   `Welcome, ${currentUser?.username || currentUser?.email}!`
      // );
      // Example: Navigate to a dashboard or home page
      if (newAuthenticated.loggedIn) isAuthenticated.value = true; // Assuming you have a route named 'Dashboard'
    },
    { immediate: false }
  ); // Don't run immediately, only on change from false to true after component setup

  onMounted(async () => {
    console.log("xxxx");
    const token = getToken;
    console.log(token);
    if (token !== null) {
      console.log(" otken");
      WebSocketService.getInstance().connect();
      try {
        await dispatchUpdateCurrentUser();
        await dispatchVipInfo();
        await dispatchGameBigWin();
        await dispatchGameSearch("");
        console.log(aerror);
        console.log(uerror);
      } catch (e) {
        console.log(e);
        setAuthenticated(false);
        setInitialAuthCheckComplete(true);
        finishLoading();
        loadingFadeOut();
        // router.push("/login");
      }
      setInitialAuthCheckComplete(true);
    } else {
      console.log("no otken");

      setAuthenticated(false);
      setInitialAuthCheckComplete(true);
      finishLoading();
      loadingFadeOut();
      console.log(aerror);
      console.log(uerror);
      // router.push("/login");
    }
    loadingFadeOut();
  });
</script>
<style></style>

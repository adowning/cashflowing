<script setup>
  import { useAuthStore } from "@/stores/auth";
  import { useUserStore } from "@/stores/user";
  import { useDepositStore } from "@/stores/deposit";

  const authStore = useAuthStore();
  const userStore = useUserStore();
  const depositStore = useDepositStore();
  const {
    isAuthenticated, // Computed property from authStore (single source of truth)
    // isLoading: authLoading, // If you need to show auth-specific loading in App.vue
    // error: authError, // Auth store errors
  } = storeToRefs(authStore);
  const {
    currentUser, // State from userStore
    // isLoading: userLoading, // If you need to show user-specific loading in App.vue
    // error: userError, // User store errors
  } = storeToRefs(userStore);
  // const isAuthenticated = computed(() => authenticated.loggedIn);
</script>

<template>
  <div
    class="relative mobile-section flex grow-1 flex-col m-0 p-0 w-screen min-h-screen h-screen overflow-hidden"
  >
    <TopBarMobile
      v-if="
        isAuthenticated &&
        !depositStore.shopOpen &&
        currentUser != undefiend &&
        currentUser !== null
      "
    />

    <slot />
    <FooterBarMobile
      v-if="
        isAuthenticated &&
        !depositStore.shopOpen &&
        currentUser != undefiend &&
        currentUser !== null
      "
    />
  </div>
</template>
<style scoped>
  .mobile-section {
    /* Background image from URL provided by user */
    background-image: url("/images/starsbg.png");
    background-size: cover; /* Cover the entire viewport */
    background-position: center; /* Center the background image */
    /* background-repeat: no-repeat;  */
    min-height: 100vh; /* Make sure the body takes at least the full viewport height */
    font-family: "Roboto", sans-serif; /* Apply a default sans-serif font */
    /* Flexbox utilities to center the game area on the page */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: auto;
    padding: 0; /* Reduced padding slightly for larger game area */
  }
</style>

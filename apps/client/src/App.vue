<template>
  <div id="app">
    <div v-if="!initialAuthCheckComplete && globalStore.isLoading">
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
        <LoginView />
      </div>
      <div v-if="authError" class="error-message">
        <p>Error: {{ authError.message }}</p>
      </div>
      <div
        v-if="globalStore.isLoading && !initialAuthCheckComplete"
        class="loading-message"
      >
        <p>Processing...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useSupabaseAuth } from './composables/useSupabaseAuth' // Adjust path if needed
  import { useGlobalStore } from './stores/global'
  import LoginView from './views/LoginView.vue'
  import { loadingFadeOut } from 'virtual:app-loading'

  const globalStore = useGlobalStore()
  const {
    isAuthenticated,
    // isLoading,
    authError,
    currentUser,
    subscribeGlobalAuth,
    initialAuthCheckComplete,
  } = useSupabaseAuth()
  const { isMobile } = useDisplay()

  const signInForm = ref({ email: '', password: '' })

  onMounted(() => {
    subscribeGlobalAuth()
    console.log('App.vue mounted, useSupabaseAuth is active.')

    loadingFadeOut()
    // isLoading = false
  })
</script>
<style></style>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import LoginView from '@/views/LoginView.vue'
  import { useAuthStore } from './stores/auth'
  import { loadingFadeOut } from 'virtual:app-loading'
  import { useGlobalStore } from './stores/global'
  import { supabase } from './supabase'

  const globalStore = useGlobalStore()
  const { isLoading, stopLoading } = useLoading()
  const { isMobile } = useDisplay()
  const authStore = useAuthStore()
  console.log(authStore.userInfo)
  if (authStore.userInfo !== undefined) {
    watch(authStore.userInfo, (user) => {
      console.log('user', user)
      if (!user) return
    })
  }
  const appReady = ref(false)

  // Check to see if user is already logged in
  const user = supabase.auth.user()

  // If user does not exist, need to make app ready
  if (!user) {
    appReady.value = true
  }

  // Runs when there is a auth state change
  // if user is logged in, this will fire
  supabase.auth.onAuthStateChange((_, session: Session) => {
    // store.methods.setUser(session)
    // authStore.dispatchUpdateUserInfo()
    authStore.setUserInfo(session.user)

    appReady.value = true
  })

  onMounted(async () => {
    var myHeaders = new Headers()
    const token = authStore.token
    if (token !== undefined) {
      myHeaders.append('Content-Type', 'application/json')
      myHeaders.append('Authorization', `Bearer ${token}`)
      var requestOptions = {
        headers: myHeaders,
      }
      const user = await fetch('/api/auth/me', requestOptions)
      const _code = await user.json()
      if (_code.code != 200) authStore.isAuthenticated = false
      stopLoading()
      console.log(isLoading.value)
      loadingFadeOut()
    }
  })
</script>

<template>
  <div class="onacona">
    <template v-if="authStore.isAuthenticated">
      <DesktopSection v-if="!isMobile">
        <RouterView />
      </DesktopSection>
      <MobileSection v-if="isMobile">
        <GlobalLoading v-if="globalStore.isLoading"></GlobalLoading>
        <RouterView v-else />
      </MobileSection>
    </template>
    <template v-else-if="!authStore.isAuthenticated">
      <LoginView />
    </template>
    <!-- <LevelUpPopup ref="levelPopup" v-if="showLevelUp" :vipLevel="authStore.userInfo.vipRankLevel" /> -->
    <ShowToasts />
  </div>
</template>

<style scoped>
  /* .glowing {
  @apply glowing-text;
} */
</style>
<template>
  <div id="app">
    <h1>Supabase Auth with Pinia</h1>

    <div v-if="!initialAuthCheckComplete && isLoading" class="loading-spinner">
      <p>Loading authentication status...</p>
      <div class="spinner"></div>
    </div>

    <div v-if="initialAuthCheckComplete">
      <div v-if="isAuthenticated && currentUser">
        <h2>Welcome, {{ currentUser.username || currentUser.email }}!</h2>
        <p>User ID: {{ currentUser.id }}</p>
        <p>Email: {{ currentUser.email }}</p>
        <div v-if="currentProfile">
          <h3>Profile:</h3>
          <p>
            Balance: {{ currentProfile.balance }} {{ currentProfile.currency }}
          </p>
          <p>XP: {{ currentProfile.xpEarned }}</p>
        </div>
        <div v-else-if="!isLoading">
          <p>No profile data found or still loading profile.</p>
        </div>
        <button @click="handleSignOut">Sign Out</button>
      </div>

      <div v-else-if="!isLoading">
        <h2>Login or Sign Up</h2>
        <form @submit.prevent="handleSignIn">
          <h3>Sign In</h3>
          <div>
            <label for="email-signin">Email:</label>
            <input
              id="email-signin"
              type="email"
              v-model="signInForm.email"
              required
            />
          </div>
          <div>
            <label for="password-signin">Password:</label>
            <input
              id="password-signin"
              type="password"
              v-model="signInForm.password"
              required
            />
          </div>
          <button type="submit" :disabled="isLoading">
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>
        <hr />
        <form @submit.prevent="handleSignUp">
          <h3>Sign Up</h3>
          <div>
            <label for="email-signup">Email:</label>
            <input
              id="email-signup"
              type="email"
              v-model="signUpForm.email"
              required
            />
          </div>
          <div>
            <label for="username-signup">Username:</label>
            <input
              id="username-signup"
              type="text"
              v-model="signUpForm.username"
              required
            />
          </div>
          <div>
            <label for="password-signup">Password:</label>
            <input
              id="password-signup"
              type="password"
              v-model="signUpForm.password"
              required
            />
          </div>
          <button type="submit" :disabled="isLoading">
            {{ isLoading ? 'Signing Up...' : 'Sign Up' }}
          </button>
        </form>
      </div>

      <div v-if="authError" class="error-message">
        <p>Error: {{ authError.message }}</p>
      </div>
      <div
        v-if="isLoading && !initialAuthCheckComplete"
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

  const {
    isAuthenticated,
    isLoading,
    authError,
    currentUser,
    currentProfile,
    signInWithPassword,
    signUpNewUser,
    signOut,
    initialAuthCheckComplete,
  } = useSupabaseAuth()

  const signInForm = ref({ email: '', password: '' })
  const signUpForm = ref({ email: '', password: '', username: '' })

  const handleSignIn = async () => {
    await signInWithPassword({
      email: signInForm.value.email,
      password: signInForm.value.password,
    })
    if (!authError.value) {
      signInForm.value = { email: '', password: '' }
    }
  }

  const handleSignUp = async () => {
    await signUpNewUser({
      email: signUpForm.value.email,
      password: signUpForm.value.password,
      options: {
        data: {
          username: signUpForm.value.username,
        },
      },
    })
    if (!authError.value) {
      signUpForm.value = { email: '', password: '', username: '' }
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  onMounted(() => {
    console.log('App.vue mounted, useSupabaseAuth is active.')
  })
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  form div {
    margin-bottom: 10px;
    text-align: left;
  }
  label {
    display: block;
    margin-bottom: 5px;
  }
  input[type='email'],
  input[type='password'],
  input[type='text'] {
    width: calc(100% - 22px);
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  button {
    background-color: #42b983;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
  }
  button:disabled {
    background-color: #aaa;
  }
  button:hover:not(:disabled) {
    background-color: #36a476;
  }
  hr {
    margin: 20px 0;
  }
  .error-message {
    color: red;
    margin-top: 15px;
    padding: 10px;
    border: 1px solid red;
    border-radius: 4px;
    background-color: #ffe0e0;
  }
  .loading-message,
  .loading-spinner {
    margin-top: 20px;
    color: #555;
  }

  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: #42b983;
    margin: 20px auto;
    animation: spin 1s ease infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
*/

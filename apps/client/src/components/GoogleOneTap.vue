<!-- <template>
  <div>
    <div
      id="g_id_onload"
      :data-client_id="googleClientId"
      data-context="signin"
      data-ux_mode="popup"
      :data-callback="handleGoogleCredentialResponseFunctionName"
      data-auto_select="false"
      data-itp_support="true"
    ></div>

    <div
      class="g_id_signin_fallback_container"
      v-show="!isLoading && showFallbackButton"
    >
      <div
        class="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
      <p class="debug-info">
        (Fallback Button Area - Visible if showFallbackButton is true and not
        loading)
      </p>
    </div>

    <p v-if="isLoading" class="loading-message">Processing Google Sign-In...</p>
    <p v-if="componentError" class="error-message">
      Component Error: {{ componentError }}
    </p>
    <p
      v-if="authError && authError.message && !componentError"
      class="error-message"
    >
      Auth Error: {{ authError.message }}
    </p>
    <div class="debug-info">
      <p>isLoading: {{ isLoading }}</p>
      <p>showFallbackButton: {{ showFallbackButton }}</p>
      <p>googleClientId configured: {{ !!googleClientId }}</p>
      <p>GIS Script Loaded: {{ gisScriptLoadedState }}</p>
      <p>GIS Initialized: {{ gisInitializedState }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  // Extend the Window interface to include the google property
  declare global {
    interface Window {
      google?: {
        accounts: {
          id: {
            initialize: (config: any) => void
            prompt: (callback: (notification: any) => void) => void
          }
        }
      }
    }
  }

  import { useSupabaseAuth } from '../composables/useSupabaseAuth' // Adjust path

  const { signInWithGoogleIdToken, isLoading, authError } = useSupabaseAuth()

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string
  const componentError = ref<string | null>(null)
  // // Initialize showFallbackButton to true. It will be set to false if One-Tap displays.
  const showFallbackButton = ref(true)
  const gisScriptLoadedState = ref(false)
  const gisInitializedState = ref(false)

  // Name of the global callback function
  const handleGoogleCredentialResponseFunctionName = 'handleSupabaseGoogleLogin'

  // Define the type for the Google Credential Response callback
  type GoogleCredentialCallback = (response: any) => Promise<void>

  // Callback function for Google Identity Services
  // Assign it to window, casting window to any or a more specific type
  ;(window as any)[handleGoogleCredentialResponseFunctionName] = async (
    response: any,
  ) => {
    console.log('Google Credential Response received:', response)
    if (isLoading.value) {
      console.warn(
        'Google Credential Response received while already loading. Ignoring.',
      )
      return
    }
    if (response.credential) {
      console.log(
        'Credential found in response. Calling signInWithGoogleIdToken.',
      )
      componentError.value = null
      try {
        await signInWithGoogleIdToken(response.credential)
        // isLoading and authError are handled by the composable.
        // If successful, onAuthStateChange handles UI updates.
      } catch (e: any) {
        console.error('Exception during signInWithGoogleIdToken call:', e)
        componentError.value =
          'An unexpected error occurred during Google sign-in processing.'
      }
    } else {
      console.error(
        'Google Sign-In failed or no credential received in response:',
        response,
      )
      componentError.value =
        'Google Sign-In credential not received. Please try again.'
    }
  }

  function loadGoogleGIS() {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      if (window.google && window.google.accounts) {
        // Check if already loaded
        gisScriptLoadedState.value = true
        console.log('Google Identity Services GIS library already loaded.')
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => {
        gisScriptLoadedState.value = true
        console.log('Google Identity Services GIS library loaded dynamically.')
        resolve(true)
      }
      script.onerror = () => {
        console.error('Failed to load Google Identity Services GIS library.')
        componentError.value =
          'Could not load Google Sign-In. Please refresh the page.'
        gisScriptLoadedState.value = false
        reject(new Error('GIS load failed'))
      }
      document.head.appendChild(script)
    })
  }

  function initializeGoogleGIS() {
    if (!gisScriptLoadedState.value || gisInitializedState.value) {
      if (gisInitializedState.value)
        console.log('GIS already initialized. Skipping re-initialization.')
      else console.log('GIS script not loaded yet. Cannot initialize.')
      return
    }

    if (!googleClientId) {
      componentError.value =
        'Google Client ID is not configured. Google Sign-In is unavailable.'
      console.error('VITE_GOOGLE_CLIENT_ID is not set.')
      return
    }

    try {
      // @ts-ignore
      if (
        window.google &&
        window.google.accounts &&
        window.google.accounts.id
      ) {
        console.log('Initializing Google Identity Services...')
        // @ts-ignore
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          // Use the globally defined function by its name.
          // The GIS library expects the name of the function on the window object.
          callback: handleGoogleCredentialResponseFunctionName,
          cancel_on_tap_outside: false,
        })
        gisInitializedState.value = true
        console.log('Google Identity Services initialized.')

        // Programmatically render the One-Tap prompt.
        console.log('Requesting Google One-Tap prompt programmatically...')
        // @ts-ignore
        window.google.accounts.id.prompt((notification: any) => {
          console.log('Google One-Tap Prompt Notification:', notification)
          // Log all available methods from the notification object for debugging
          for (const key in notification) {
            if (typeof notification[key] === 'function') {
              try {
                console.log(`Notification.${key}():`, notification[key]())
              } catch (e) {
                console.log(`Notification.${key}(): Error calling - ${e}`)
              }
            } else {
              console.log(`Notification.${key}:`, notification[key])
            }
          }

          // Check if the prompt is actually displayed
          if (notification.isDisplayMoment && notification.isDisplayMoment()) {
            console.log('One-Tap UI is displayed. Hiding fallback button.')
            showFallbackButton.value = false
          } else if (
            notification.isNotDisplayed &&
            notification.isNotDisplayed()
          ) {
            const reason = notification.getNotDisplayedReason
              ? notification.getNotDisplayedReason()
              : 'Unknown reason'
            console.log(
              `One-Tap UI was not displayed. Reason: ${reason}. Showing fallback button.`,
            )
            showFallbackButton.value = true
          } else if (
            notification.isSkippedMoment &&
            notification.isSkippedMoment()
          ) {
            const reason = notification.getSkippedReason
              ? notification.getSkippedReason()
              : 'Unknown reason'
            console.log(
              `One-Tap UI was skipped. Reason: ${reason}. Showing fallback button.`,
            )
            showFallbackButton.value = true
          } else if (
            notification.isDismissedMoment &&
            notification.isDismissedMoment()
          ) {
            const reason = notification.getDismissedReason
              ? notification.getDismissedReason()
              : 'Unknown reason'
            console.log(
              `One-Tap UI was dismissed by user. Reason: ${reason}. Showing fallback button.`,
            )
            showFallbackButton.value = true
          } else {
            console.log(
              'One-Tap UI status unclear or not actively displayed. Ensuring fallback button is considered.',
            )
            if (
              !showFallbackButton.value &&
              !(notification.isDisplayMoment && notification.isDisplayMoment())
            ) {
              showFallbackButton.value = true
            }
          }
        })

        // If GIS is initialized and showFallbackButton is true, Google should render the button
        // in the .g_id_signin div automatically because the class is present.
        if (showFallbackButton.value) {
          console.log(
            'Fallback button should be visible and rendered by Google if GIS initialized.',
          )
        }
      } else {
        console.error(
          'Google GIS objects (window.google.accounts.id) not available. Retrying initialization soon.',
        )
        setTimeout(initializeGoogleGIS, 600)
      }
    } catch (error) {
      console.error('Error initializing Google GIS:', error)
      componentError.value = 'Error setting up Google Sign-In.'
      gisInitializedState.value = false
    }
  }

  onMounted(async () => {
    console.log('GoogleLoginButton: Component Mounted.')
    if (!googleClientId) {
      componentError.value =
        'Google Sign-In is not configured (Missing Client ID).'
      console.error('VITE_GOOGLE_CLIENT_ID is missing in .env file.')
      showFallbackButton.value = false
      return
    }
    try {
      await loadGoogleGIS()
      setTimeout(initializeGoogleGIS, 100)
    } catch (error) {
      console.error(
        'GoogleLoginButton: Error during onMounted GIS setup:',
        error,
      )
    }
  })

  onUnmounted(() => {
    console.log('GoogleLoginButton: Component Unmounted.')
    // @ts-ignore
    if (window[handleGoogleCredentialResponseFunctionName]) {
      // @ts-ignore
      delete window[handleGoogleCredentialResponseFunctionName]
      console.log(
        `Cleaned up global callback: ${handleGoogleCredentialResponseFunctionName}`,
      )
    }
    gisInitializedState.value = false
  })

  watch(isLoading, (newLoading, oldLoading) => {
    if (newLoading === false && oldLoading === true) {
      if (authError.value) {
        componentError.value = null
      }
    }
  })
</script>

<style scoped>
  .g_id_signin_fallback_container {
    display: inline-block;
    margin-top: 10px;
  }
  .g_id_signin {
    color: green;
    /* This class is targeted by Google's library to render the button. */
  }
  .error-message {
    color: red;
    margin-top: 10px;
    font-size: 14px;
  }
  .loading-message {
    color: #555;
    margin-top: 10px;
    font-size: 14px;
  }
  .debug-info {
    margin-top: 15px;
    padding: 10px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    font-size: 12px;
    text-align: left;
    opacity: 0.7;
  }
  .debug-info p {
    margin: 2px 0;
  }
</style> -->

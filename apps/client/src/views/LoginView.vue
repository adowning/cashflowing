<script lang="ts" setup>
  // import { ref, reactive, computed, onMounted, onUnmounted, watch } from "vue";
  import { useRouter } from "vue-router"; // For navigation after login
  import { useAuthStore } from "@/stores/auth"; // To potentially watch isAuthenticated or session
  import { useNotificationStore } from "@/stores/notifications"; // For user feedback
  import { loadingFadeOut } from "virtual:app-loading";
  import { createAuthClient } from "better-auth/vue";
  import { oneTapClient } from "better-auth/client/plugins";
  import { useUserStore } from "@/stores/user";

  const authClient = createAuthClient({
    plugins: [
      oneTapClient({
        clientId:
          "740187878164-qoahkvecq5tu5d8os02pomr7nifcgh8s.apps.googleusercontent.com",
        // Optional client configuration:
        autoSelect: false,
        cancelOnTapOutside: true,
        context: "signin",
        additionalOptions: {
          // Any extra options for the Google initialize method
        },
        // Configure prompt behavior and exponential backoff:
        promptOptions: {
          baseDelay: 1000, // Base delay in ms (default: 1000)
          maxAttempts: 5, // Maximum number of attempts before triggering onPromptNotification (default: 5)
        },
      }),
    ],
  }); // Assuming you have a client for better-auth
  // Import other stores if they are DIRECTLY needed for view logic not covered by useBetterAuth
  // import { useUserStore } from "@/stores/user";
  // import { useProfileStore } from "@/stores/profile";

  // import Logo from "@/components/icons/Logo.vue"; // Assuming you have a Logo component

  // --- Composables & Stores ---
  const router = useRouter();
  const {
    isLoading: isAuthLoading, // Renamed to avoid conflict if component has its own isLoading
    errorState, // For displaying login/signup errors
    // currentProfile, // Often not needed directly in login view, but available
    signInWithPassword,
    // authenticated,
    signUpNewUser,
    signInWithGoogleIdToken, // From useBetterAuth for Google Sign In
    // signOut, // Sign out is usually on a different page/component
    initialAuthCheckComplete,
  } = useAuthStore();
  const {
    // For displaying login/signup errors
    currentUser,
    // From useBetterAuth (which gets it from useCashflowSocket)
  } = useUserStore();
  const authStore = useAuthStore(); // For direct observation if needed
  const authenticated = authStore.authenticated;
  const notificationStore = useNotificationStore();

  // --- Component State ---
  const uiMode = ref<"signIn" | "signUp">("signIn"); // To toggle between sign-in and sign-up views in the flip card

  const formData = reactive({
    email: "", // Default to empty or test values for quick testing
    password: "",
    confirmPassword: "", // For sign-up
    username: "", // For sign-up
    // promoCode: '', // If you have promo codes for sign-up
  });

  const componentLoading = ref(false); // For UI elements specific to this component's loading state
  const googleScriptLoaded = ref(false);

  // --- Computed Properties ---
  const currentAuthError = computed(() => errorState?.message || null);

  // --- Methods ---
  const handleSignIn = async () => {
    if (!formData.email || !formData.password) {
      notificationStore.addNotification(
        "error",
        "Please enter both email and password."
      );
      return;
    }
    componentLoading.value = true;
    await signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    componentLoading.value = false;

    if (!errorState && authenticated.loggedIn) {
      notificationStore.addNotification("success", "Successfully signed in!");
      // router.push('/dashboard'); // Or your desired redirect path
    } else if (errorState) {
      notificationStore.addNotification(
        "error",
        errorState.message || "Sign in failed. Please try again."
      );
    }
  };

  const handleSignUp = async () => {
    if (!formData.email || !formData.password || !formData.username) {
      notificationStore.addNotification(
        "error",
        "Please fill in all required fields for sign up."
      );
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      notificationStore.addNotification("error", "Passwords do not match.");
      return;
    }

    componentLoading.value = true;
    await signUpNewUser({
      email: formData.email,
      password: formData.password,
      username: formData.username,
      // You can add other properties to SignUpPayload if your backend expects them
      // e.g., promoCode: formData.promoCode,
    });
    componentLoading.value = false;

    if (!errorState && authenticated.loggedIn) {
      // Assuming signUpNewUser also logs in the user
      notificationStore.addNotification(
        "success",
        "Successfully signed up and logged in!"
      );
      // router.push('/dashboard'); // Or your desired redirect path
    } else if (errorState) {
      notificationStore.addNotification(
        "error",
        errorState.message || "Sign up failed. Please try again."
      );
    }
  };
  const baOneTap = async () => {
    console.log(componentLoading.value);
    console.log(isAuthLoading);
    if (componentLoading.value || isAuthLoading) {
      console.warn(
        "Google One Tap response received while already loading. Ignoring."
      );
      notificationStore.addNotification(
        "warning",
        "Processing a previous request, please wait."
      );
      return;
    }
    componentLoading.value = true;
    await authClient.oneTap({
      autoSelect: true,
      cancelOnTapOutside: true,
      context: "signin",
      additionalOptions: {
        // Any extra options for the Google initialize method
      },
    });
    componentLoading.value = false;
  };
  // Google Sign-In Handler
  const handleGoogleSignIn = async (response: any) => {
    if (componentLoading.value || isAuthLoading) {
      console.warn(
        "Google Credential Response received while already loading. Ignoring."
      );
      notificationStore.addNotification(
        "warning",
        "Processing a previous request, please wait."
      );
      return;
    }
    if (response.credential) {
      componentLoading.value = true;
      await signInWithGoogleIdToken(response.credential);
      componentLoading.value = false;
      if (!errorState && authenticated.loggedIn) {
        notificationStore.addNotification(
          "success",
          "Successfully signed in with Google!"
        );
        // router.push('/dashboard');
      } else if (errorState) {
        notificationStore.addNotification(
          "error",
          errorState.message || "Google sign-in failed."
        );
      }
    } else {
      notificationStore.addNotification(
        "error",
        "Google Sign-In credential not received. Please try again."
      );
      console.error(
        "Google Sign-In failed or no credential received:",
        response
      );
    }
  };

  // Watch for authentication changes to redirect
  // watch(
  //  authenticated,
  //     if (isAuth) {
  watch(
    authenticated,
    (newAuthenticated) => {
      // User has successfully authenticated (either via form or Google)
      console.log("User authenticated, current user:", currentUser);
      notificationStore.addNotification(
        "info",
        `Welcome, ${currentUser?.username || currentUser?.email}!`
      );
      // Example: Navigate to a dashboard or home page
      if (newAuthenticated.loggedIn) router.push({ name: "Home" }); // Assuming you have a route named 'Dashboard'
    },
    { immediate: false }
  ); // Don't run immediately, only on change from false to true after component setup

  // To expose handleGoogleSignIn to the global scope for the Google button callback
  onMounted(() => {
    loadingFadeOut();

    authStore.clearAuthError();
    // Make sure Google Sign-In script is loaded
    if (!(window as any).google || !(window as any).google.accounts) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        googleScriptLoaded.value = true;
        console.log("Google GSI script loaded.");
        if (
          (window as any).google &&
          (window as any).google.accounts &&
          (window as any).google.accounts.id
        ) {
          (window as any).google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // Ensure this is in your .env
            callback: handleGoogleSignIn, // Assign your component method directly
          });
          (window as any).google.accounts.id.renderButton(
            document.getElementById("googleSignInButtonContainer"), // Target a specific div for rendering
            {
              theme: "outline",
              size: "large",
              type: "standard",
              text: "signin_with",
            }
          );
          // (window as any).google.accounts.id.prompt(); // Optional: Auto prompt
        } else {
          console.error(
            "Google GSI library not fully available after script load."
          );
          notificationStore.addNotification(
            "error",
            "Could not initialize Google Sign-In."
          );
        }
      };
      script.onerror = () => {
        console.error("Failed to load Google GSI script.");
        notificationStore.addNotification(
          "error",
          "Failed to load Google Sign-In script."
        );
      };
      document.head.appendChild(script);
    } else if (
      (window as any).google &&
      (window as any).google.accounts &&
      (window as any).google.accounts.id
    ) {
      // Script already loaded, just initialize and render button
      googleScriptLoaded.value = true;
      (window as any).google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn,
      });
      // Ensure the container exists before rendering
      const googleButtonContainer = document.getElementById(
        "googleSignInButtonContainer"
      );
      if (googleButtonContainer) {
        (window as any).google.accounts.id.renderButton(googleButtonContainer, {
          theme: "outline",
          size: "large",
          type: "standard",
          text: "signin_with",
        });
      } else {
        console.warn(
          "Google Sign-In button container not found on mount (it might appear later)."
        );
      }
    }

    // If already authenticated when visiting login page (e.g., direct navigation, browser back button)
    if (authenticated.loggedIn) {
      router.push({ name: "Home" }); // Or your main app page
    }
  });
  const isSignUpMode = ref(false); // false = login, true = signup
  const flipCardInner = ref<HTMLElement | null>(null);

  // ...

  // Toggle for flip card
  function toggleMode() {
    isSignUpMode.value = !isSignUpMode.value; // This updates the reactive state
    if (flipCardInner.value) {
      if (isSignUpMode.value) {
        flipCardInner.value.style.transform = "rotateY(180deg)";
      } else {
        flipCardInner.value.style.transform = "rotateY(0deg)";
      }
    }
    // Clear form errors when toggling
    authStore.setError(null); // Assuming authStore is your Pinia store instance
  }
  onUnmounted(() => {
    loadingFadeOut();

    // Clean up global callback if it was set, though direct assignment to google.accounts.id.initialize is preferred
    // if ((window as any).handleSignInWithGoogleGlobal === handleGoogleSignIn) {
    //   delete (window as any).handleSignInWithGoogleGlobal;
    // }
  });
</script>

<template>
  <div class="login-view-container">
    <!-- <div class="wrapper"> -->
    <Logo class="logo-main">
      <!-- <img
        src="/images/sparkle.gif"
        style="z-index: 999999; position: relative"
      /> -->
    </Logo>
    <!-- <div v-if="currentAuthError" class="auth-error-message">
        <p>{{ currentAuthError }}</p>
      </div>
      <div v-else>
        <div style="min-height: 50px" class="my-4" />
      </div> -->
    <div
      class="auth-mode-toggle mb-5"
      :class="{ 'is-signup-active': isSignUpMode }"
      @click="toggleMode"
      @keydown="toggleMode"
      tabindex="0"
      role="switch"
      aria-label="Toggle Sign Up Mode"
    >
      <span class="lab login-label" :class="{ active: !isSignUpMode }"
        >Log In</span
      >
      <div class="switch-visual-container">
        <div class="switch-track"></div>
        <div class="switch-knob"></div>
      </div>
      <span class="lab signup-label" :class="{ active: isSignUpMode }"
        >Sign Up</span
      >
    </div>
    <div class="mt-14 flex flex-col justify-center items-start pt-16">
      <!-- <div class="flex flex-col items-center" style="width: 100%; height: 40px"> -->

      <!-- </div> -->
      <!-- <div v-if="currentAuthError" class="auth-error-message">
            <p>{{ currentAuthError }}</p>
          </div> -->
      <!-- <div v-else>
            <div style="min-height: 50px" class="my-4" />
          </div> -->
      <!-- </div> -->

      <label class="switch mt-4">
        <!-- <input
          class="toggle"
          type="checkbox"
          :checked="isSignUpMode"
          @change="toggleMode"
        /> -->

        <!-- <span class="slider" />
        <span class="card-side" /> -->
        <div class="flip-card__inner" ref="flipCardInner">
          <div class="flip-card__front">
            <div class="title">Log In</div>
            <form @submit.prevent="handleSignIn" class="flip-card__form">
              <input
                v-model="formData.email"
                type="email"
                placeholder="Email"
                required
                class="flip-card__input"
                :disabled="isAuthLoading || componentLoading"
              />
              <input
                v-model="formData.password"
                type="password"
                placeholder="Password"
                required
                autocomplete="current-password"
                class="flip-card__input"
                :disabled="isAuthLoading || componentLoading"
              />
              <button
                type="submit"
                class="flip-card__btn"
                :disabled="isAuthLoading || componentLoading"
              >
                Let's Go!
              </button>
            </form>
            <div class="social-login-divider">OR</div>
            <!-- <div
              id="googleSignInButtonContainer"
              class="google-signin-container"
            ></div> -->
            <button
              id="googleSignInButtonContainer"
              class="google-signin-button"
              @click="baOneTap"
              :disabled="isAuthLoading || componentLoading"
            />
          </div>

          <div class="flip-card__back">
            <div class="title">Sign Up</div>
            <form @submit.prevent="handleSignUp" class="flip-card__form">
              <input
                v-model="formData.username"
                type="text"
                placeholder="Username"
                required
                class="flip-card__input"
                :disabled="isAuthLoading || componentLoading"
              />
              <input
                v-model="formData.email"
                type="email"
                placeholder="Email"
                required
                class="flip-card__input"
                :disabled="isAuthLoading || componentLoading"
              />
              <input
                v-model="formData.password"
                type="password"
                placeholder="Password"
                required
                autocomplete="new-password"
                class="flip-card__input"
                :disabled="isAuthLoading || componentLoading"
              />
              <input
                v-model="formData.confirmPassword"
                type="password"
                placeholder="Confirm Password"
                required
                autocomplete="new-password"
                class="flip-card__input"
                :disabled="isAuthLoading || componentLoading"
              />
              <button
                type="submit"
                class="flip-card__btn"
                :disabled="isAuthLoading || componentLoading"
              >
                Confirm!
              </button>
            </form>
          </div>
        </div>
      </label>
    </div>
  </div>
  <!-- </div> -->
  <div v-if="isAuthLoading || componentLoading" class="loading-indicator">
    <GlobalLoading />
  </div>
</template>

<style scoped>
  .auth-mode-toggle {
    /* CSS Variables for easy theming and consistent sizing */
    --toggle-track-width: 50px;
    --toggle-track-height: 26px;
    --knob-size: 20px;
    /* Horizontal padding within the track for the knob */
    --track-internal-padding: 3px;

    /* Colors */
    --track-bg-login: #b954f3; /* Tailwind gray-400 */
    --track-bg-signup: #4a90e2; /* Tailwind blue-400 */
    --knob-bg-color: white;
    --text-color-inactive: #718096; /* Tailwind gray-600 */
    --text-color-active: #b954f3; /* Tailwind gray-800 */
    --label-font-weight-inactive: 400;
    --label-font-weight-active: 600;
    --focus-ring-color: #b954f3; /* Blue-400 for focus outline */

    /* Transitions */
    --transition-duration: 0.3s;
    --transition-timing-function: ease-in-out;
    margin-bottom: 20px;
    height: 50px;
    display: inline-flex; /* Use inline-flex to allow other elements on the same line */
    align-items: center;
    gap: 8px; /* Space between labels and the switch visual */
    cursor: pointer;
    user-select: none; /* Prevents text selection when clicking */
    padding: 4px; /* Padding for focus ring visibility */
    border-radius: 18px; /* Rounded corners for the entire component for focus */
    outline: none; /* Remove default outline, we'll add a custom one */
  }

  .auth-mode-toggle:focus-visible {
    box-shadow: 0 0 0 2px var(--focus-ring-color);
  }

  .lab {
    font-size: 18px;
    font-weight: 700;
    transition:
      color var(--transition-duration) var(--transition-timing-function),
      font-weight var(--transition-duration) var(--transition-timing-function);
  }

  .login-label {
    color: var(--text-color-inactive);
    font-weight: var(--label-font-weight-inactive);
  }
  .auth-mode-toggle .login-label.active {
    color: var(--text-color-active);
    font-weight: var(--label-font-weight-active);
  }

  .signup-label {
    color: var(--text-color-inactive);
    font-weight: var(--label-font-weight-inactive);
  }
  .auth-mode-toggle .signup-label.active {
    color: var(--text-color-active);
    font-weight: var(--label-font-weight-active);
  }

  .switch-visual-container {
    position: relative;
    width: var(--toggle-track-width);
    height: var(--toggle-track-height);
  }

  .switch-track {
    width: 100%;
    height: 100%;
    background-color: var(--track-bg-login);
    border-radius: calc(var(--toggle-track-height) / 2); /* Pill shape */
    transition: background-color var(--transition-duration)
      var(--transition-timing-function);
  }

  /* Change track background when sign up is active */
  .auth-mode-toggle.is-signup-active .switch-track {
    background-color: var(--track-bg-signup);
  }

  .switch-knob {
    position: absolute;
    top: calc((var(--toggle-track-height) - var(--knob-size)) / 2);
    left: var(--track-internal-padding);
    width: var(--knob-size);
    height: var(--knob-size);
    background-color: var(--knob-bg-color);
    border-radius: 50%; /* Circular knob */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: transform var(--transition-duration)
      var(--transition-timing-function);
  }

  /* Move knob to the right when sign up is active */
  .auth-mode-toggle.is-signup-active .switch-knob {
    transform: translateX(
      calc(
        var(--toggle-track-width) - var(--knob-size) -
          (2 * var(--track-internal-padding))
      )
    );
  }
  /* Scoped styles specific to LoginView */
  .login-view-container {
    width: 100%;
    min-height: 100%; /* Ensure it takes full viewport height */
    margin-top: 0;
    display: flex; /* Use flex to center content */
    flex-direction: column;
    justify-content: start; /* Vertically center */
    align-items: center; /* Horizontally center */
    /* background-image: url('/src/assets/login-bg.jpg'); */ /* Ensure path is correct if used */
    background-size: cover; /* Changed from contain for full coverage */
    background-position: center; /* Center the background */
    background-repeat: no-repeat;
    background-color: #021130;
    background-image: url("/images/starsbg.png");
    background-size: 120% 120%;
    background-origin: border-box;
    background-position: center;
    background-repeat: no-repeat;
    height: 100vh;
    padding: 20px; /* Add some padding for smaller screens */
    box-sizing: border-box;
  }

  .wrapper {
    /* Removed height: 100vh and width: 80vw to let content size itself within login-view-container */
    /* max-width: 520px; Already handled by parent */
    width: 100%; /* Take full width of the centered container */
    /* margin: auto; */
    display: flex;
    flex-direction: column;
    justify-content: start; /* Center flip card vertically if space allows */
    align-items: center;
    color: white; /* Assuming default text color is white based on original */
  }

  .logo-main {
    width: 70%;
    /* margin-top: 2rem; Vuetify mt-8 is usually 2rem */
    /* margin-bottom: 2rem; Add some space below logo */
  }

  .auth-error-message {
    background-color: rgba(255, 0, 0, 0.1);
    color: red;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 15px;
    border: 1px solid red;
    text-align: center;
    width: 100%;
    max-width: 420px; /* Match form width */
  }

  .loading-indicator {
    color: #fff;
    margin-bottom: 15px;
  }

  /* Flip card styles from the original component */
  .switch {
    transform: translateY(
      0
    ); /* Adjusted from -200px, let flexbox handle positioning */
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    width: 50px;
    height: 20px;
    margin-top: 2rem; /* Add some margin above the switch */
    margin-bottom: 2rem;
  }

  .card-side::before {
    position: absolute;
    content: "Log in";
    left: -70px;
    top: 0;
    width: 200px;
    text-decoration: underline;
    color: var(--font-color, #fefefe); /* Added fallback */
    font-weight: 600;
    /* content: "Log in"; ... etc. */
    z-index: 1; /* Above the card, below the slider */
  }

  .card-side::after {
    position: absolute;
    content: "Sign up";
    left: 70px;
    top: 0;
    width: 200px;
    text-decoration: none;
    color: var(--font-color, #fefefe); /* Added fallback */
    font-weight: 600;
    position: absolute;
    /* content: "Sign up"; ... etc. */
    z-index: 1; /* Above the card, below the slider */
  }

  .toggle {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    box-sizing: border-box;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--bg-color);
    transition: 0.3s;
    position: absolute;
    /* cursor: pointer; ... etc. */
    z-index: 2; /* Ensure slider is on top for interaction and visibility */
  }

  .slider:before {
    box-sizing: border-box;
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    border: 2px solid var(--main-color);
    border-radius: 5px;
    left: -2px;
    bottom: 2px;
    background-color: var(--bg-color);
    box-shadow: 0 3px 0 var(--main-color);
    transition: 0.3s;
  }

  .toggle:checked + .slider {
    background-color: var(--input-focus);
  }

  .toggle:checked + .slider:before {
    transform: translateX(30px);
  }

  .toggle:checked ~ .card-side:before {
    text-decoration: none;
  }

  .toggle:checked ~ .card-side:after {
    text-decoration: underline;
  }
  /* Logic for toggle moved to JS for direct style manipulation for simplicity */
  /* .toggle:checked + .slider { background-color: var(--input-focus, #2d8cf0); } */
  /* .toggle:checked + .slider:before { transform: translateX(30px); } */
  /* .toggle:checked ~ .card-side:before { text-decoration: none; } */
  /* .toggle:checked ~ .card-side:after { text-decoration: underline; } */

  .flip-card__inner {
    width: 320px; /* Take full width of its parent label */
    max-width: 420px; /* Max width for the form area */
    height: auto; /* Let content define height, was 350px */
    min-height: 380px; /* Ensure enough space for inputs */
    position: relative;
    background-color: transparent;
    perspective: 1000px;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
    margin-top: 16px;
    position: relative; /* This should already be present */
    z-index: 0;
  }

  .flip-card__front,
  .flip-card__back {
    box-sizing: border-box; /* Added for better padding control */
    width: 100%;
    /* max-width: 420px; /* Let parent control max-width */
    padding: 20px; /* Unified padding */
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; /* Center form content */
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    background: var(--bg-color, #1f2937); /* Slightly lighter dark for card */
    gap: 15px; /* Adjusted gap */
    border-radius: 8px; /* Softer radius */
    border: 1px solid var(--main-color, #b954f3); /* Thinner border */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* Softer shadow */
  }

  .flip-card__back {
    transform: rotateY(180deg);
  }

  .flip-card__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px; /* Adjusted gap */
    width: 100%; /* Form takes full width of card */
  }

  .title {
    margin-bottom: 15px; /* Adjusted margin */
    font-size: 24px; /* Slightly smaller */
    font-weight: 700; /* Adjusted weight */
    text-align: center;
    color: var(--font-color, #fefefe);
  }

  .flip-card__input {
    width: 100%; /* Full width inputs */
    max-width: 300px; /* Max width for inputs */
    height: 45px; /* Slightly taller */
    border-radius: 5px;
    border: 2px solid var(--main-color, #b954f3);
    background-color: var(--bg-color-input, #2c3748); /* Different input bg */
    box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2); /* Inset shadow */
    font-size: 16px;
    font-weight: 500;
    color: var(--font-color, #fefefe);
    padding: 5px 15px; /* More padding */
    outline: none;
    transition: border-color 0.3s;
  }

  .flip-card__input::placeholder {
    color: var(--font-color-sub, #7e7e7e);
    opacity: 0.8;
  }

  .flip-card__input:focus {
    border-color: var(--input-focus, #2d8cf0); /* Use border-color for focus */
  }

  .flip-card__btn {
    margin-top: 15px; /* Adjusted margin */
    width: auto; /* Let content define width */
    min-width: 150px; /* Minimum width */
    padding: 10px 20px; /* Padding for button */
    height: 45px;
    border-radius: 5px;
    border: 2px solid var(--main-color, #b954f3);
    background-color: var(--main-color, #b954f3); /* Button bg same as border */
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2); /* Softer shadow */
    font-size: 16px;
    font-weight: 600;
    color: var(--font-color-btn, #fefefe); /* Ensure button text color is set */
    cursor: pointer;
    transition:
      background-color 0.3s,
      box-shadow 0.3s,
      transform 0.1s;
  }
  .flip-card__btn:hover {
    background-color: darken(
      var(--main-color, #b954f3),
      10%
    ); /* Darken on hover */
  }
  .flip-card__btn:active {
    box-shadow: 0px 0px var(--main-color, #b954f3);
    transform: translate(2px, 2px); /* Slightly less movement */
  }
  .flip-card__btn:disabled {
    background-color: #555;
    border-color: #444;
    color: #888;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  .social-login-divider {
    margin: 15px 0;
    color: var(--font-color-sub, #7e7e7e);
    text-align: center;
    width: 100%;
  }
  .google-signin-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 10px;
  }

  /* CSS Variables for theming (optional, but good practice) */
  :root {
    --input-focus: #4a90e2; /* Example: A lighter blue */
    --font-color: #e0e0e0; /* Light gray for text */
    --font-color-sub: #a0a0a0; /* Medium gray for subtext/placeholders */
    --bg-color: #1e2a3b; /* Dark blue-gray background */
    --bg-color-input: #2c3a4b; /* Slightly lighter for inputs */
    --main-color: #6c63ff; /* Example: A vibrant purple */
    --font-color-btn: #ffffff;
  }
</style>

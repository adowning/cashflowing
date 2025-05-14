// apps/client/src/stores/user.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { getApiClient } from "@/sdk/apiClient";
import { useAuthStore } from "./auth";

import type {
  UserType,
  UpdateUserInput,
  SetReferrerDto,
} from "@cashflow/types"; // Or @repo/types

import type {
  ClientChangePasswordPayload, // Assuming exported from apiClient.ts or defined in types
  PaginatedResponse,
  ApiErrorData,
} from "@/sdk/apiClient"; // Import these from apiClient or define globally if preferred

// Define a generic error state structure for actions if not using ApiErrorData directly
interface ActionErrorState extends ApiErrorData {} // Re-alias or extend if needed

export const useUserStore = defineStore("user", () => {
  const authStore = useAuthStore();

  const isLoadingProfileUpdate = ref<boolean>(false);
  const errorProfileUpdate = ref<ActionErrorState | null>(null);
  const isLoadingPasswordChange = ref<boolean>(false);
  const errorPasswordChange = ref<ActionErrorState | null>(null);
  const isLoadingAvatarUpdate = ref<boolean>(false);
  const errorAvatarUpdate = ref<ActionErrorState | null>(null);
  const isLoadingSetReferrer = ref<boolean>(false);
  const errorSetReferrer = ref<ActionErrorState | null>(null);
  const referrals = ref<UserType[] | null>(null);
  const isLoadingReferrals = ref<boolean>(false);
  const errorReferrals = ref<ActionErrorState | null>(null);
  const leaderboardData = ref<PaginatedResponse<UserType> | null>(null);
  const isLoadingLeaderboard = ref<boolean>(false);
  const errorLeaderboard = ref<ActionErrorState | null>(null);

  async function updateUserProfile(payload: UpdateUserInput) {
    isLoadingProfileUpdate.value = true;
    errorProfileUpdate.value = null;
    try {
      const api = getApiClient();
      const updatedUser = await api.users.updateCurrentUser(payload);
      if (authStore.accessToken) {
        authStore.setAuthData({
          accessToken: authStore.accessToken,
          refreshToken: authStore.refreshToken,
          user: updatedUser,
        });
      }
      return { success: true, user: updatedUser };
    } catch (e: any) {
      console.error("UserStore: Failed to update profile", e);
      const errData =
        e instanceof Error
          ? {
              message: e.message,
              code: (e as any).code,
              details: (e as any).data,
            }
          : { message: "Unknown error" };
      errorProfileUpdate.value = errData;
      return { success: false, error: errData };
    } finally {
      isLoadingProfileUpdate.value = false;
    }
  }

  async function changePassword(payload: ClientChangePasswordPayload) {
    isLoadingPasswordChange.value = true;
    errorPasswordChange.value = null;
    try {
      const api = getApiClient();
      await api.users.changePassword(payload);
      return { success: true };
    } catch (e: any) {
      console.error("UserStore: Failed to change password", e);
      const errData =
        e instanceof Error
          ? {
              message: e.message,
              code: (e as any).code,
              details: (e as any).data,
            }
          : { message: "Unknown error" };
      errorPasswordChange.value = errData;
      return { success: false, error: errData };
    } finally {
      isLoadingPasswordChange.value = false;
    }
  }

  async function updateUserAvatar(formData: FormData) {
    isLoadingAvatarUpdate.value = true;
    errorAvatarUpdate.value = null;
    try {
      const api = getApiClient();
      const updatedUserWithNewAvatar = await api.users.updateAvatar(formData);
      if (authStore.accessToken) {
        authStore.setAuthData({
          accessToken: authStore.accessToken,
          refreshToken: authStore.refreshToken,
          user: updatedUserWithNewAvatar,
        });
      }
      return { success: true, user: updatedUserWithNewAvatar };
    } catch (e: any) {
      console.error("UserStore: Failed to update avatar", e);
      const errData =
        e instanceof Error
          ? {
              message: e.message,
              code: (e as any).code,
              details: (e as any).data,
            }
          : { message: "Unknown error" };
      errorAvatarUpdate.value = errData;
      return { success: false, error: errData };
    } finally {
      isLoadingAvatarUpdate.value = false;
    }
  }

  async function setReferrerCode(payload: SetReferrerDto) {
    isLoadingSetReferrer.value = true;
    errorSetReferrer.value = null;
    try {
      const api = getApiClient();
      await api.users.setReferrer(payload);
      // Consider re-fetching user from authStore if referrer info is critical post-update
      // await authStore.initializeAuth(); // Or a more specific user fetch
      return { success: true };
    } catch (e: any) {
      console.error("UserStore: Failed to set referrer", e);
      const errData =
        e instanceof Error
          ? {
              message: e.message,
              code: (e as any).code,
              details: (e as any).data,
            }
          : { message: "Unknown error" };
      errorSetReferrer.value = errData;
      return { success: false, error: errData };
    } finally {
      isLoadingSetReferrer.value = false;
    }
  }

  async function fetchMyReferrals() {
    isLoadingReferrals.value = true;
    errorReferrals.value = null;
    try {
      const api = getApiClient();
      const referralData = await api.users.getMyReferrals();
      referrals.value = referralData;
      return { success: true, data: referralData };
    } catch (e: any) {
      console.error("UserStore: Failed to fetch referrals", e);
      const errData =
        e instanceof Error
          ? {
              message: e.message,
              code: (e as any).code,
              details: (e as any).data,
            }
          : { message: "Unknown error" };
      errorReferrals.value = errData;
      referrals.value = null;
      return { success: false, error: errData };
    } finally {
      isLoadingReferrals.value = false;
    }
  }

  async function fetchLeaderboard(page: number = 1, limit: number = 10) {
    isLoadingLeaderboard.value = true;
    errorLeaderboard.value = null;
    try {
      const api = getApiClient();
      const data = await api.users.getLeaderboard({ page, limit });
      leaderboardData.value = data;
      return { success: true, data };
    } catch (e: any) {
      console.error("UserStore: Failed to fetch leaderboard", e);
      const errData =
        e instanceof Error
          ? {
              message: e.message,
              code: (e as any).code,
              details: (e as any).data,
            }
          : { message: "Unknown error" };
      errorLeaderboard.value = errData;
      leaderboardData.value = null;
      return { success: false, error: errData };
    } finally {
      isLoadingLeaderboard.value = false;
    }
  }

  function clearActionError(
    errorType:
      | "profileUpdate"
      | "passwordChange"
      | "avatarUpdate"
      | "setReferrer"
      | "referrals"
      | "leaderboard"
  ) {
    switch (errorType) {
      case "profileUpdate":
        errorProfileUpdate.value = null;
        break;
      case "passwordChange":
        errorPasswordChange.value = null;
        break;
      case "avatarUpdate":
        errorAvatarUpdate.value = null;
        break;
      case "setReferrer":
        errorSetReferrer.value = null;
        break;
      case "referrals":
        errorReferrals.value = null;
        break;
      case "leaderboard":
        errorLeaderboard.value = null;
        break;
    }
  }

  return {
    isLoadingProfileUpdate,
    errorProfileUpdate,
    isLoadingPasswordChange,
    errorPasswordChange,
    isLoadingAvatarUpdate,
    errorAvatarUpdate,
    isLoadingSetReferrer,
    errorSetReferrer,
    referrals,
    isLoadingReferrals,
    errorReferrals,
    leaderboardData,
    isLoadingLeaderboard,
    errorLeaderboard,
    updateUserProfile,
    changePassword,
    updateUserAvatar,
    setReferrerCode,
    fetchMyReferrals,
    fetchLeaderboard,
    clearActionError,
  };
});

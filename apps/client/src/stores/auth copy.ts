// import { defineStore } from "pinia";
// import type { Session, AuthError } from "@supabase/supabase-js";

// import { ref, computed } from "vue"; // Import reactive functions
// import { NETWORK_CONFIG, User } from "@cashflow/types";
// import type * as SignIn from "@cashflow/types";
// import type * as SignUp from "@cashflow/types";
// // import type * as User from '@cashflow/types'
// import type {
//   GetUserAmountResponseData,
//   GetUserInfoResponseData,
//   User as IUser,
//   UpdateEmail,
//   UpdatePassword,
//   UpdateSuspendUser,
// } from "@cashflow/types";
// import { handleException } from "./exception"; // Assuming this path is correct
// import { router } from "@/router";
// import { NetworkData } from "@/utils/NetworkData";
// import { Network } from "@/utils/Network";

// export const useAuthStore = defineStore(
//   "auth",
//   () => {
//     // State properties converted to reactive references
//     const success = ref(false);
//     const errMessage = ref("");
//     const authModalType = ref("");
//     const dialogCheckbox = ref(false);
//     const authDialogVisible = ref(false);
//     const signUpForm = ref(false);
//     const nickNameDialogVisible = ref(false);
//     const token = ref<string | undefined>(NetworkData.getInstance().getToken());
//     const userInfo = ref<Partial<User>>();
//     const session = ref<Session | null>(null);
//     const loading = ref<boolean>(false);
//     const error = ref<AuthError | null>(null);
//     const initialAuthCheckComplete = ref<boolean>(false);

//     // Actions
//     function setSession(newSession: Session | null) {
//       session.value = newSession;
//     }

//     function setLoading(isLoading: boolean) {
//       loading.value = isLoading;
//     }

//     function setError(authError: AuthError | null) {
//       error.value = authError;
//     }

//     function setInitialAuthCheckComplete(isComplete: boolean) {
//       initialAuthCheckComplete.value = isComplete;
//     }

//     // const userInfo = ref<IUser>({
//     //   id: '',
//     //   name: '',
//     //   email: '',
//     //   emailVerified: false,
//     //   image: '',
//     //   createdAt: undefined,
//     //   updatedAt: undefined,
//     //   lastDailySpin: undefined,
//     //   twoFactorEnabled: false,
//     //   role: '',
//     //   banned: false,
//     //   banReason: '',
//     //   banExpires: undefined,
//     //   username: '',
//     //   passwordHash: '',
//     //   totalXp: 0,
//     //   balance: 0,
//     //   isVerified: false,
//     //   active: false,
//     //   lastLogin: undefined,
//     //   verificationToken: '',
//     //   avatar: '',
//     //   activeProfileId: '',
//     //   gender: 'BOY',
//     //   status: 'ACTIVE',
//     //   cashtag: '',
//     //   phpId: 0,
//     //   accessToken: '',
//     //   VipInfo: undefined,
//     //   activeProfile: {
//     //     transactions: [],
//     //     id: '',
//     //     balance: 0,
//     //     xpEarned: 0,
//     //     isActive: false,
//     //     lastPlayed: undefined,
//     //     createdAt: undefined,
//     //     updatedAt: undefined,
//     //     phpId: 0,
//     //     userId: '',
//     //     currency: '',
//     //     shopId: '',
//     //   },
//     // })
//     const userAmount = ref({
//       amount: 111111,
//       currency: {
//         fiat: true,
//         name: "",
//         symbol: "R$",
//         type: "BRL",
//       },
//       withdraw: 111111,
//       rate: 1000,
//     });

//     // Getters converted to computed properties
//     const getSuccess = computed(() => success.value);
//     const getErrMessage = computed(() => errMessage.value);
//     const getAuthModalType = computed(() => authModalType.value);
//     const getToken = computed(() => token.value);
//     const getUserInfo = computed(() => userInfo.value);
//     const getUserAmount = computed(() => userAmount.value);
//     const getDialogCheckbox = computed(() => dialogCheckbox.value);
//     const getAuthDialogVisible = computed(() => authDialogVisible.value);
//     const getSignUpForm = computed(() => signUpForm.value);
//     const getNickNameDialogVisible = computed(
//       () => nickNameDialogVisible.value
//     );
//     const isAuthenticated = ref(false);
//     // Actions converted to regular functions
//     const setAuthModalType = (type: string) => {
//       authModalType.value = type;
//     };

//     const setSuccess = (isSuccess: boolean) => {
//       success.value = isSuccess;
//     };

//     const setErrorMessage = (message: string) => {
//       errMessage.value = message;
//     };
//     const setIsAuthenticated = (b: boolean) => {
//       isAuthenticated.value = b;
//       console.log(router.currentRoute.value.path);
//       if (router.currentRoute.value.path == "/login") router.push("/home");
//     };
//     const setToken = (newToken: string) => {
//       const networkData: NetworkData = NetworkData.getInstance();
//       // const netCfg: Netcfg = Netcfg.getInstance()
//       networkData.setToken(newToken);
//       // netCfg.setToken(newToken)
//       token.value = newToken;
//     };

//     const removeToken = () => {
//       token.value = undefined;
//       const networkData: NetworkData = NetworkData.getInstance();
//       networkData.resetData();
//       // Reset userInfo to its initial state
//       userInfo.value = {
//         id: "",
//         name: "",
//         email: "",
//         emailVerified: false,
//         image: "",
//         twoFactorEnabled: false,
//         role: "",
//         banned: false,
//         banReason: "",
//         username: "",
//         passwordHash: "",
//         totalXp: 0,
//         balance: 0,
//         isVerified: false,
//         active: false,
//         verificationToken: "",
//         avatar: "",
//         activeProfileId: "",
//         gender: "BOY",
//         status: "ACTIVE",
//         cashtag: "",
//         phpId: 0,
//         accessToken: "",
//         vipInfo: {
//           id: "",
//           level: 0,
//           deposit_exp: 0,
//           bet_exp: 0,
//           rank_bet_exp: 0,
//           rank_deposit_exp: 0,
//           rank_name: null,
//           icon: null,
//           exp_switch_type: null,
//           now_deposit_exp: null,
//           level_deposit_exp: null,
//           now_bet_exp: null,
//           level_bet_exp: null,
//           telegram: null,
//           is_protection: false,
//           protection_deposit_exp: null,
//           protection_deposit_amount: null,
//           protection_bet_exp: null,
//           protection_bet_amount: null,
//           protection_days: null,
//           protection_switch: null,
//           cycle_award_switch: false,
//           level_award_switch: false,
//           signin_award_switch: false,
//           bet_award_switch: false,
//           withdrawal_award_switch: false,
//           unprotection_deposit_exp: null,
//           unprotection_deposit_amount: null,
//           unprotection_bet_exp: null,
//           unprotection_bet_amount: null,
//           unprotection_days: null,
//           unprotection_switch: null,
//           main_currency: null,
//           can_receive_level_award: false,
//           can_receive_rank_award: false,
//           can_receive_day_award: false,
//           can_receive_week_award: false,
//           can_receive_month_award: false,
//           can_receive_signin_award: false,
//           can_receive_bet_award: false,
//           can_receive_withdrawal_award: false,
//           userid: null,
//           free_spin_times: null,
//           week_gift: null,
//           month_gift: null,
//           upgrade_gift: null,
//           now_cash_back: null,
//           yesterday_cash_back: null,
//           history_cash_back: null,
//           gamesession: [],
//           operator: null,
//           transactions: [],
//           user: null,
//           operatorId: "",
//         },
//         currentProfile: {
//           id: "",
//           balance: 0,
//           xpEarned: 0,
//           userId: "",
//           currency: "",
//           shopId: "",
//           // operator: null,
//           // userProfileUseridtouser: null,
//           phpId: "null",
//           gamesession: [],
//           tournamententry: [],
//           transactions: [],
//         },
//       };
//     };

//     const setUserInfo = (info: Partial<IUser>) => {
//       userInfo.value = info;
//     };

//     const setUserAmount = (amount: SignIn.GetUserAmount) => {
//       userAmount.value = amount;
//     };

//     const setDialogCheckbox = (checked: boolean) => {
//       dialogCheckbox.value = checked;
//     };

//     const setAuthDialogVisible = (visible: boolean) => {
//       authDialogVisible.value = visible;
//     };

//     const setSignUpForm = (isSignUp: boolean) => {
//       signUpForm.value = isSignUp;
//     };

//     const setNickNameDialogVisible = (visible: boolean) => {
//       nickNameDialogVisible.value = visible;
//     };

//     // Dispatch functions (actions)
//     const dispatchSignIn = async (msg: SignIn.SigninRequestData) => {
//       setSuccess(false);
//       const route: string = NETWORK_CONFIG.LOGIN.LOGIN;
//       const network: Network = Network.getInstance();

//       const next = (response: SignIn.GetSigninResponseData) => {
//         if (response.code == 200) {
//           console.log(response.token);
//           setToken(response.token);
//           setSuccess(true);
//           console.log(success.value);
//           return success.value;
//         } else {
//           setErrorMessage(handleException(response.code));
//           return success.value;
//         }
//       };
//       await network.sendMsg(route, msg, next, 1);
//       return success.value;
//     };
//     const dispatchGetSession = async () => {
//       setSuccess(false);
//       const msg = null;
//       const route: string = NETWORK_CONFIG.LOGIN.ME;
//       const network: Network = Network.getInstance();

//       const next = (response: SignIn.GetSigninResponseData) => {
//         if (response.code == 200) {
//           console.log(response.token);
//           setToken(response.token);
//           setSuccess(true);
//           console.log(success.value);
//           return success.value;
//         } else {
//           setErrorMessage(handleException(response.code));
//           return success.value;
//         }
//       };
//       await network.sendMsg(route, msg, next, 1);
//       return success.value;
//     };
//     const dispatchSignUp = async (
//       msg: SignUp.SignupRequestData
//     ): Promise<Boolean> => {
//       setSuccess(false);
//       const route: string = NETWORK_CONFIG.LOGIN.REGISTER;
//       const network: Network = Network.getInstance();

//       const next = (response: SignUp.GetSignupResponseData) => {
//         console.log(response.code);
//         if (response.code == 200) {
//           // setToken(response.token)
//           setSuccess(true);
//           console.log(success.value);
//           return success.value;
//         } else {
//           setErrorMessage(handleException(response.code));
//           return success.value;
//         }
//       };
//       await network.sendMsg(route, msg, next, 1);
//       return success.value;
//     };

//     const dispatchUserProfile = async () => {
//       setSuccess(false);
//       const route: string = NETWORK_CONFIG.PERSONAL_INFO_PAGE.USER_INFO;
//       const network: Network = Network.getInstance();

//       const next = (response: GetUserInfoResponseData) => {
//         if (response.code == 200) {
//           if (response.data.avatar == "") {
//             response.data.avatar = new URL(
//               "@/assets/public/image/ua_public_10.png",
//               import.meta.url
//             ).href;
//           }
//           if (response.data == null || response.data == undefined) return;
//           setErrorMessage("");
//           setUserInfo(response.data);
//           setSuccess(true);
//         } else {
//           if (response.code == 101004) {
//             dispatchSignout();
//           }
//           setErrorMessage(handleException(response.code));
//         }
//       };
//       await network.sendMsg(route, {}, next, 1, 4);
//     };

//     const dispatchUserAmount = async () => {
//       setSuccess(false);
//       const route: string = NETWORK_CONFIG.PERSONAL_INFO_PAGE.USER_AMOUNT;
//       const network: Network = Network.getInstance();

//       const next = (response: GetUserAmountResponseData) => {
//         if (response.code == 200) {
//           setUserAmount(response.data);
//           setSuccess(true);
//         } else {
//           setErrorMessage(handleException(response.code));
//         }
//       };
//       await network.sendMsg(route, {}, next, 1, 4);
//     };

//     const dispatchUpdateUserInfo = async (data: any) => {
//       setSuccess(false);
//       const route: string = NETWORK_CONFIG.PERSONAL_INFO_PAGE.USER_CHANGE;
//       const network: Network = Network.getInstance();

//       const next = (response: GetUserInfoResponseData) => {
//         if (response.code == 200) {
//           setSuccess(true);
//         } else {
//           setErrorMessage(handleException(response.code));
//         }
//       };
//       await network.sendMsg(route, data, next, 1);
//     };

//     const dispatchUpdateEmail = async (data: UpdateEmail) => {
//       setSuccess(false);
//       const route: string = NETWORK_CONFIG.PERSONAL_INFO_PAGE.USER_EMAIL;
//       const network: Network = Network.getInstance();

//       const next = (response: GetUserInfoResponseData) => {
//         if (response.code == 200) {
//           setSuccess(true);
//         } else {
//           setErrorMessage(handleException(response.code));
//         }
//       };
//       await network.sendMsg(route, data, next, 1);
//     };

//     const dispatchUpdatePassword = async (data: UpdatePassword) => {
//       setSuccess(false);
//       const route: string = NETWORK_CONFIG.PERSONAL_INFO_PAGE.USER_PASSWORD;
//       const network: Network = Network.getInstance();

//       const next = (response: GetUserInfoResponseData) => {
//         if (response.code == 200) {
//           setSuccess(true);
//         } else {
//           setErrorMessage(handleException(response.code));
//         }
//       };
//       await network.sendMsg(route, data, next, 1);
//     };

//     const dispatchSuspendUser = async (data: UpdateSuspendUser) => {
//       setSuccess(false);
//       const route: string = NETWORK_CONFIG.PERSONAL_INFO_PAGE.USER_SUSPEND;
//       const network: Network = Network.getInstance();

//       const next = (response: GetUserInfoResponseData) => {
//         if (response.code == 200) {
//           setSuccess(true);
//         } else {
//           setErrorMessage(handleException(response.code));
//         }
//       };
//       await network.sendMsg(route, data, next, 1);
//     };

//     const dispatchSignout = () => {
//       removeToken();
//     };

//     // Return all state, getters, and actions
//     return {
//       success,
//       errMessage,
//       authModalType,
//       dialogCheckbox,
//       authDialogVisible,
//       signUpForm,
//       nickNameDialogVisible,
//       dispatchGetSession,
//       token,
//       userInfo,
//       userAmount,
//       getSuccess,
//       getErrMessage,
//       getAuthModalType,
//       getToken,
//       getUserInfo,
//       getUserAmount,
//       getDialogCheckbox,
//       getAuthDialogVisible,
//       getSignUpForm,
//       getNickNameDialogVisible,
//       setIsAuthenticated,
//       setAuthModalType,
//       setSuccess,
//       setErrorMessage,
//       setToken,
//       removeToken,
//       setUserInfo,
//       setUserAmount,
//       setDialogCheckbox,
//       setAuthDialogVisible,
//       setSignUpForm,
//       setNickNameDialogVisible,
//       dispatchSignIn,
//       dispatchSignUp,
//       dispatchUserProfile,
//       dispatchUserAmount,
//       dispatchUpdateUserInfo,
//       dispatchUpdateEmail,
//       dispatchUpdatePassword,
//       dispatchSuspendUser,
//       dispatchSignout,
//       session,
//       loading,
//       error,
//       initialAuthCheckComplete,
//       setSession,
//       setLoading,
//       setError,
//       setInitialAuthCheckComplete,
//       isAuthenticated,
//     };
//   },
//   { persist: true }
// );

// // export const authStore = useAuthStore()

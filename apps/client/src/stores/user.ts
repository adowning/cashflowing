import { store } from "@/stores";
import { setToken as _setToken, getToken, removeToken } from "@/utils/cookies";
import { handleException } from "./exception";
import { NETWORK_CONFIG } from "@cashflow/types";
import type {
  GetUserData,
  GetUserInfoResponseData,
  Profile,
  ProfileStatsUpdateData,
  Transaction,
  User,
  UserStatsUpdateData,
} from "@cashflow/types";
import type {
  GetUserBalance,
  GetUserBalanceResponseData,
} from "@cashflow/types";
import { Network } from "@/utils/Network";
import { logToPage } from "@/utils/logger";
import { fetchApi } from "@/utils/fetchApi";
import { useGlobalStore } from "./global";
import { useAuthStore } from "./auth";

// Define a more specific type for the user based on your Tables.user.Row
const expScale = [
  1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000,
];

export const useUserStore = defineStore(
  "user",
  () => {
    const currentUser = ref<Partial<User> | null>(null);
    const currentProfile = ref<Partial<Profile> | null>(null);
    const transactions = ref<Transaction[]>([]);
    const currentUserBalance = ref(0);
    const xpEarned = ref(0);
    const totalXp = ref(0);
    const isAuthenticated = ref<boolean>(false);
    const roles = ref<string[]>([]);
    const success = ref<boolean>(false);
    const errMessage = ref<string>("");
    const userBalance = ref<GetUserBalance>();
    // const currentUser = ref<UserData>(null);

    // Actions
    function setUser(userData: Partial<User>) {
      currentUser.value = userData;
    }

    function clearUser() {
      currentUser.value = null;
    }
    function clearProfile() {
      currentProfile.value = null;
    }
    const percentOfVipLevel = computed(() => {
      // if (currentUser.value === undefined) return 0
      // const nextXpLevel = expScale[currentUser.value.vipRankLevel as number]
      // console.log(nextXpLevel)
      // console.log(currentUser.value.vipPoints / nextXpLevel)
      // return (15 / nextXpLevel) * 100
    });
    const setUserBalance = (_userBalance: GetUserBalance) => {
      console.log("setUserBalance", _userBalance);
      userBalance.value = _userBalance;
    };
    const updateCurrentUserProfile = (
      _profileUpdate: ProfileStatsUpdateData
    ) => {
      console.log("updateCurrentUserProfile", _profileUpdate);
      currentUserBalance.value = _profileUpdate.balance;
      xpEarned.value = _profileUpdate.xpEarned;
    };
    const updateCurrentUser = (_userUpdate: UserStatsUpdateData) => {
      console.log("updateCurrentUser", _userUpdate);
      currentUserBalance.value = _userUpdate.balance;
      totalXp.value = _userUpdate.totalXp;
    };
    const getCurrentUser = computed(() => {
      return currentUser.value;
    });
    const getCurrentProfile = computed(() => {
      return currentProfile.value;
    });
    const getUserBalance = () => {
      return userBalance;
    };

    const setSuccess = (value: boolean) => {
      success.value = value;
    };
    const setCurrentUser = (_user: Partial<User>) => {
      currentUser.value = _user;
    };
    const setCurrentProfile = (_user: Partial<Profile>) => {
      currentProfile.value = _user;
    };
    const setErrorMessage = (value: string) => {
      errMessage.value = value;
    };
    // const updateInfo = async () => {
    //   const result = await api.userControllerFindCurerentUser.send()
    //   const data = result.data
    //   if (data === null) return false
    //   console.log(data)
    //   currentUser.value = data
    //   // roles.value = data.activeProfile.roles
    //   return data
    // }

    const updateCurrentUserBalance = (balanceUpdate: any | number) => {
      console.log(balanceUpdate);
      if (currentUser.value == undefined) return;
      // currentUser.value = userInfo
      if (typeof balanceUpdate !== "number") {
        if (balanceUpdate.new_balance) {
          currentUser.value.balance = balanceUpdate.new_balance;
        }
      }
      if (typeof balanceUpdate === "number") {
        currentUser.value.balance = balanceUpdate;
      }
    };
    const setUserInfo = (userInfo: User) => {
      currentUser.value = userInfo;
    };

    const setUserGameStat = (stat: string, value: number) => {
      //@ts-ignore
      currentUser.value[stat] = value;
      //@ts-ignore
      console.log(currentUser.value[stat]);
      // }
    };

    const resetToken = () => {
      removeToken();
      roles.value = [];
    };
    // const register = async (username: string, password: string): Promise<boolean> => {
    //   console.log(username)
    //   const avatar = '11'
    //   const shopId = 'house'
    //   const result = await authController.register(
    //     {},
    //     {
    //       username,
    //       password,
    //       avatar,
    //       shopId,
    //     },
    //   )
    //   console.log(result)
    //   console.log(result.token.token)
    //   if (result.code !== 0) return false
    //   if (result.data === null) return false
    //   setToken(result.token.token)
    //   Cookies.set('laravel_session', result.token.token)
    //   localStorage.setItem('access_token', result.token.token)
    //   const hydrated = await hydrateStores()
    //   console.log(hydrated)
    //   localStorage.setItem('isAuthenticated', 'true')
    //   isAuthenticated.value = hydrated
    //   const ablyToken = result.ablyToken
    //   localStorage.set('ably-token', ablyToken)
    //   return hydrated
    // }

    // const login = async (name: string, password: string): Promise<boolean> => {
    // const { stopLoading } = useLoading()
    // const cashflowStore = useCashflowStore()
    // const socketStore = useSocketStore()
    // const notificationStore = useNotificationStore()
    // // const result = await authController.login({}, { username: name, password })
    // await cashflowStore.connect(name, password)
    // if (result.status === 401) {
    //   notificationStore.addNotification('Invalid credentials', 'error')
    //   return false
    // }
    // if (typeof result.access_token !== 'string') return false
    // setToken(result.access_token)
    // Cookies.set('laravel_session', result.access_token)
    // localStorage.setItem('access_token', result.access_token)
    // const hydrated = await hydrateStores()
    // localStorage.setItem('isAuthenticated', hydrated.toString())
    // isAuthenticated.value = hydrated
    // socketStore.dispatchSocketConnect()
    // console.log('user hydrated ? ', hydrated)
    // setTimeout(() => {
    //   console.log('delaying 5k to watch loading')
    //   router.push('/home')
    //   stopLoading()
    // }, 5000)
    // return true
    // }
    // async dispatchSetUserCurrency(currency:string) {
    const dispatchSetUserCurrency = async (currency: string) => {
      // this.setSuccess(false);
      const route: string = NETWORK_CONFIG.PERSONAL_INFO_PAGE.SET_USER_CURRENCY;
      const network: Network = Network.getInstance();
      // response call back function
      const next = (response: any) => {
        if (response.code == 200) {
          setSuccess(true);
        } else {
          setErrorMessage(handleException(response.code));
        }
      };
      await network.sendMsg(route, { currency_type: currency }, next, 1);
    };
    // const dispatchDepositHistory = async () => {
    //   // this.setSuccess(false);
    //   const route: string = NETWORK_CONFIG.DEPOSIT_PAGE.HISTORY;
    //   const network: Network = Network.getInstance();
    //   // response call back function
    //   const next = (response: any) => {
    //     if (response.code == 200) {
    //       setSuccess(true);
    //     } else {
    //       setErrorMessage(handleException(response.code));
    //     }
    //   };
    //   await network.sendMsg(route, undefined, next, 1);
    // };
    const dispatchUserBalance = async () => {
      setSuccess(false);
      const route: string = NETWORK_CONFIG.PERSONAL_INFO_PAGE.USER_BALANCE;
      const network: Network = Network.getInstance();
      // response call back function
      const next = (response: GetUserBalanceResponseData) => {
        if (response.code == 200) {
          setSuccess(true);
          setUserBalance(response.data);
        } else {
          setErrorMessage(handleException(response.code));
        }
      };
      await network.sendMsg(route, {}, next, 1, 4);
    };
    const dispatchUpdateCurrentUser2 = async (): Promise<void> => {
      console.log("dissin cu ");
      setSuccess(false);
      const route: string = "/auth/session";
      const network: Network = Network.getInstance();
      // response call back function
      const next = (response: GetUserInfoResponseData) => {
        console.log(response);
        if (response.code == 200) {
          setSuccess(true);
          setCurrentUser(response.user);
          setCurrentProfile(response.profile);
        } else {
          setSuccess(false);
          setErrorMessage(handleException(response.code));
        }
      };
      network.sendMsg(route, {}, next, 1, 4);
    };
    const dispatchUpdateCurrentUser = async () => {
      logToPage(
        "event",
        "Handling User Update event for user ID:"
        // userPayload?.id
      );
      const authStore = useAuthStore();
      // if (
      //   userPayload &&
      //   userPayload.id &&
      //   currentUser.value?.id === userPayload.id
      // ) {
      const { isLoading, startLoading, finishLoading } = useGlobalStore();
      startLoading();
      // Re-fetch for full consistency is safer than merging partials
      // const fullUserData = await fetchPublicUserData(userPayload.id);
      const token = authStore.session?.token;
      const headers = new Headers({});
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      const response = await fetch(`/auth/session`, { headers });
      const fullUserData = await response.json();
      //       if (userData) {
      //         userStore.setUser(userData as Partial<User>); // Update store
      //         logToPage("info", `User data fetched and set for ${userId}`);
      //       }
      //       return userData as Partial<User> | null;
      console.log(fullUserData);
      if (fullUserData) {
        // userStore.setUser(fullUserData); // fetchPublicUserData already does this
        // If ClientAuthUser structure (in session) needs updating based on UserData
        // if (
        //   // authStore.session?.user &&
        //   // authStore.session.user.id === fullUserData.id

        // ) {
        setCurrentUser(fullUserData.user);
        setCurrentProfile(fullUserData.profile);
        // authStore.setSession({
        //   ...authStore.session,
        //   user: {
        //     // Map fields from UserData to ClientAuthUser as needed
        //     ...authStore.session.user, // Keep existing ClientAuthUser fields
        //     id: fullUserData.id, // from UserData
        //     email: fullUserData.email as string, // from UserData
        //     username: fullUserData.username, // from UserData
        //     avatarUrl: fullUserData.avatar, // from UserData
        //     // ... other fields from UserData that map to ClientAuthUser
        //   },
        // });
        finishLoading();
      } else {
        finishLoading();
      }
      // }
    };

    const dispatchUserCashtag = async (cashtag: string) => {
      setSuccess(false);
      const route: string = NETWORK_CONFIG.PERSONAL_INFO_PAGE.USER_CASHTAG;
      const network: Network = Network.getInstance();
      // response call back function
      const next = (response: GetUserBalanceResponseData) => {
        if (response.code == 200) {
          setSuccess(true);
          setUserBalance(response.data);
        } else {
          setErrorMessage(handleException(response.code));
        }
      };
      await network.sendMsg(route, cashtag, next, 1, 4);
    };
    // const login2 = async (msg: SignIn.SigninRequestData) => {
    //   const notificationStore = useNotificationStore()
    //   setSuccess(false)
    //   const route: string = NETWORK_CONFIG.LOGIN.LOGIN
    //   const network: Network = Network.getInstance()

    //   // response call back function
    //   console.log(route)
    //   console.log(msg)
    //   const next = (response: SignIn.GetSigninResponseData) => {
    //     console.log(response)
    //     if (response.code == 200) {
    //       Cookies.set('laravel_session', response.token)
    //       Cookies.set('token', response.token)
    //       setToken(response.token)
    //       setUserInfo(response.)
    //       setSuccess(true)
    //     } else {
    //       console.log(response.code)
    //       notificationStore.addNotification(handleException(response.code), 'error')
    //       setErrorMessage(handleException(response.code))
    //     }
    //   }
    //   await network.sendMsg(route, msg, next, 2)
    // }
    const dispatchSignout = async (): Promise<void> => {
      removeToken();
    };

    return {
      dispatchSignout,
      getCurrentUser,
      getCurrentProfile,
      setUserGameStat,
      dispatchUserBalance,
      updateCurrentUserBalance,
      roles,
      setUserInfo,
      transactions,
      // register,
      getUserBalance,
      updateCurrentUserProfile,
      dispatchSetUserCurrency,
      updateCurrentUser,
      setCurrentUser,
      dispatchUserCashtag,
      errMessage,
      // username,
      // login2,
      dispatchUpdateCurrentUser,
      currentUser,
      currentProfile,
      setCurrentProfile,
      setUser,
      clearUser,
      clearProfile,
      percentOfVipLevel,
      resetToken,
      isAuthenticated,
    };
  },
  {
    persist: true,
  }
);

/**
 * @description In SPA applications, allows the store to be used before the Pinia instance becomes active.
 * @descriptionn SSR applications, allows the store to be used outside of a component'ssetup()context.
 */
export function useUserStoreOutside() {
  return useUserStore(store);
}

import { store } from '@/stores'
import { setToken as _setToken, getToken, removeToken } from '@/utils/cache/cookies'
import { handleException } from './exception'
import { NETWORK_CONFIG } from 'shared/types/NetworkCfg'
import { Network } from '@/net/Network'
import type { User } from 'shared/'
import type { GetUserBalance, GetUserBalanceResponseData } from 'shared/interface/user'

const expScale = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000]

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref<string>(getToken() || '')
    const currentUser = ref<User>()
    const isAuthenticated = ref<boolean>(false)
    const roles = ref<string[]>([])
    const success = ref<boolean>(false)
    const errMessage = ref<string>('')
    const userBalance = ref<GetUserBalance>()

    const percentOfVipLevel = computed(() => {
      // if (currentUser.value === undefined) return 0
      // const nextXpLevel = expScale[currentUser.value.vipRankLevel as number]
      // console.log(nextXpLevel)
      // console.log(currentUser.value.vipPoints / nextXpLevel)
      // return (15 / nextXpLevel) * 100
    })
    const setUserBalance = (_userBalance: GetUserBalance) => {
      console.log('setUserBalance', _userBalance)
      userBalance.value = _userBalance
    }
    // const updateCurrentUserProfile = (_profileUpdate: ProfileStatsUpdateData) => {
    //   console.log('updateCurrentUserProfile', _profileUpdate)
    //   currentUser.value.activeProfile.balance = _profileUpdate.balance
    //   currentUser.value.activeProfile.xpEarned = _profileUpdate.xpEarned
    // }
    // const updateCurrentUser = (_userUpdate: UserStatsUpdateData) => {
    //   console.log('updateCurrentUser', _userUpdate)
    //   currentUser.value.balance = _userUpdate.balance
    //   currentUser.value.totalXp = _userUpdate.totalXp
    // }
    const getCurrentUser = computed(() => {
      return currentUser.value
    })
    const getUserBalance = () => {
      return userBalance
    }
    const setToken = (value: string) => {
      _setToken(value)
      token.value = value
    }
    const setSuccess = (value: boolean) => {
      success.value = value
    }
    const setCurrentUser = (_user: User) => {
      currentUser.value = _user
    }
    const setErrorMessage = (value: string) => {
      errMessage.value = value
    }
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
      console.log(balanceUpdate)
      if (currentUser.value == undefined) return
      // currentUser.value = userInfo
      if (typeof balanceUpdate !== 'number') {
        if (balanceUpdate.new_balance) {
          currentUser.value.balance = balanceUpdate.new_balance
        }
      }
      if (typeof balanceUpdate === 'number') {
        currentUser.value.balance = balanceUpdate
      }
    }
    const setUserInfo = (userInfo: User) => {
      currentUser.value = userInfo
    }

    const setUserGameStat = (stat: string, value: number) => {
      //@ts-ignore
      currentUser.value[stat] = value
      //@ts-ignore
      console.log(currentUser.value[stat])
      // }
    }
    const changeRoles = (role: string) => {
      const newToken = `token-${role}`
      token.value = newToken
      _setToken(newToken)
      location.reload()
    }

    const resetToken = () => {
      removeToken()
      token.value = ''
      roles.value = []
    }
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
      const route: string = NETWORK_CONFIG.PERSONAL_INFO_PAGE.SET_USER_CURRENCY
      const network: Network = Network.getInstance()
      // response call back function
      const next = (response: any) => {
        if (response.code == 200) {
          setSuccess(true)
        } else {
          setErrorMessage(handleException(response.code))
        }
      }
      await network.sendMsg(route, { currency_type: currency }, next, 1)
    }
    const dispatchUserBalance = async () => {
      setSuccess(false)
      const route: string = NETWORK_CONFIG.PERSONAL_INFO_PAGE.USER_BALANCE
      const network: Network = Network.getInstance()
      // response call back function
      const next = (response: GetUserBalanceResponseData) => {
        if (response.code == 200) {
          setSuccess(true)
          setUserBalance(response.data)
        } else {
          setErrorMessage(handleException(response.code))
        }
      }
      await network.sendMsg(route, {}, next, 1, 4)
    }
    const dispatchUserCashtag = async (cashtag: string) => {
      setSuccess(false)
      const route: string = NETWORK_CONFIG.PERSONAL_INFO_PAGE.USER_CASHTAG
      const network: Network = Network.getInstance()
      // response call back function
      const next = (response: GetUserBalanceResponseData) => {
        if (response.code == 200) {
          setSuccess(true)
          setUserBalance(response.data)
        } else {
          setErrorMessage(handleException(response.code))
        }
      }
      await network.sendMsg(route, cashtag, next, 1, 4)
    }
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
      removeToken()
    }

    return {
      dispatchSignout,
      getCurrentUser,
      currentUser,
      setUserGameStat,
      dispatchUserBalance,
      token,
      updateCurrentUserBalance,
      roles,
      setUserInfo,
      // register,
      getUserBalance,
      // updateCurrentUserProfile,
      dispatchSetUserCurrency,
      // updateCurrentUser,
      setCurrentUser,
      dispatchUserCashtag,
      // username,
      // login2,
      setToken,
      // updateInfo,
      percentOfVipLevel,
      changeRoles,
      resetToken,
      isAuthenticated,
    }
  },
  {
    persist: true,
  },
)

/**
 * @description 在 SPA 应用中可用于在 pinia 实例被激活前使用 store
 * @description 在 SSR 应用中可用于在 setup 外使用 store
 */
export function useUserStoreOutside() {
  return useUserStore(store)
}

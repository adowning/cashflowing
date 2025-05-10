import { defineStore } from 'pinia'
import { ref, computed } from 'vue' // Import reactive functions
import type * as Vip from '@cashflow/types'
// import { i18n } from '@/locale/index' // Assuming this path is correct and i18n is initialized
import { NETWORK_CONFIG } from '@cashflow/types'
// import * as Toast from "vue-toastification/dist/index.mjs"; // Replaced with Nuxt UI useToast if applicable
import { handleException } from './exception' // Assuming this path is correct
import { Network } from '@/utils/Network'

// Assuming SuccessIcon and WarningIcon are available or replaced by Nuxt UI icons
// import SuccessIcon from "@/components/global/notification/SuccessIcon.vue";
// import WarningIcon from "@/components/global/notification/WarningIcon.vue";

// If using Nuxt UI Pro, you would use:
// import { useI18n } from 'vue-i18n'
// const toast = useToast();

export const useVipStore = defineStore(
  'vip',
  () => {
    // State properties converted to reactive references
    const success = ref(false)
    const errMessage = ref('')
    const levelUpDialogVisible = ref(false)
    const vipInfo = ref<Vip.VipInfo>({} as Vip.VipInfo) // Keeping type assertion as in original
    const vipLevels = ref<Array<Vip.VipLevel>>([])
    const vipTasks = ref<Array<Vip.VipTaskItem>>([])
    const vipRebateHistory = ref<Vip.VipRebateHistoryData>({
      total: 0,
      list: [],
    })
    const vipLevelRewardHistory = ref<Vip.VipLevelRewardHistoryData>({
      total: 0,
      list: [],
    })
    const vipTimesHistory = ref<Vip.VipTimesHistoryData>({
      total: 0,
      list: [],
    })
    const vipSignIn = ref<Vip.VipSignInData>({
      award: [],
      signin_day: 0,
      is_signin: 0,
      limited_bet: 0,
      limited_deposit: 0,
      vip_level: 0,
    })
    const vipLevelUpList = ref<Vip.VipLevelUpListData>(
      {} as Vip.VipLevelUpListData,
    ) // Keeping type assertion as in original
    const vipLevelUpReceive = ref<Vip.VipLevelUpReceiveData>(
      {} as Vip.VipLevelUpReceiveData,
    ) // Keeping type assertion as in original
    const vipNavBarToggle = ref(localStorage.getItem('vipBar') || '') // Initialize from localStorage
    const vipCycleawardList = ref<Vip.VipCycleawardListData>(
      {} as Vip.VipCycleawardListData,
    ) // Keeping type assertion as in original
    const vipLevelAward = ref<Vip.VipLevelAwardData>(
      {} as Vip.VipLevelAwardData,
    ) // Keeping type assertion as in original
    const vipBetawardList = ref<Vip.vipBetawardListData>(
      {} as Vip.vipBetawardListData,
    ) // Keeping type assertion as in original

    // Getters converted to computed properties
    const getSuccess = computed(() => success.value)
    const getErrMessage = computed(() => errMessage.value)
    const getVipInfo = computed(() => vipInfo.value)
    const getVipLevels = computed(() => vipLevels.value)
    const getVipTasks = computed(() => vipTasks.value)
    const getVipRebateHistory = computed(() => vipRebateHistory.value)
    const getVipLevelRewardHistory = computed(() => vipLevelRewardHistory.value)
    const getVipTimesHistory = computed(() => vipTimesHistory.value)
    const getVipSignIn = computed(() => vipSignIn.value)
    const getLevelUpDialogVisible = computed(() => levelUpDialogVisible.value)
    const getVipLevelUpList = computed(() => vipLevelUpList.value)
    const getVipLevelUpReceive = computed(() => vipLevelUpReceive.value)
    const getVipNavBarToggle = computed(() => vipNavBarToggle.value)
    const getVipCycleawardList = computed(() => vipCycleawardList.value)
    const getVipLevelAward = computed(() => vipLevelAward.value)
    const getVipBetawardList = computed(() => vipBetawardList.value)

    // const { t } = useI18n()

    // Actions converted to regular functions
    const setSuccess = (isSuccess: boolean) => {
      success.value = isSuccess
    }

    const setErrorMessage = (message: string) => {
      errMessage.value = message
    }

    const setVipInfo = (info: Vip.VipInfo) => {
      vipInfo.value = info
    }

    const setVipLevels = (levels: Array<Vip.VipLevel>) => {
      vipLevels.value = levels
    }

    const setVipTasks = (tasks: Array<Vip.VipTaskItem>) => {
      vipTasks.value = tasks
    }

    const setVipRebateHistory = (history: Vip.VipRebateHistoryData) => {
      vipRebateHistory.value = history
    }

    const setVipLevelRewardHistory = (
      history: Vip.VipLevelRewardHistoryData,
    ) => {
      vipLevelRewardHistory.value = history
    }

    const setVipTimesHistory = (history: Vip.VipTimesHistoryData) => {
      vipTimesHistory.value = history
    }

    const setVipSignIn = (signInData: Vip.VipSignInData) => {
      vipSignIn.value = signInData
    }

    const setLevelUpDialogVisible = (visible: boolean) => {
      levelUpDialogVisible.value = visible
    }

    const setVipLevelUpList = (list: Vip.VipLevelUpListData) => {
      vipLevelUpList.value = list
    }

    const setVipLevelUpReceive = (receiveData: Vip.VipLevelUpReceiveData) => {
      vipLevelUpReceive.value = receiveData
    }

    const setVipNavBarToggle = (toggle: string) => {
      vipNavBarToggle.value = toggle
      localStorage.setItem('vipBar', toggle) // Update localStorage
    }

    // Storing periodic rewards  存储周期性奖励
    const setVipCycleawardList = (list: Vip.VipCycleawardListData) => {
      vipCycleawardList.value = list
    }

    // Storage level related rewards  存储等级相关奖励
    const setVipLevelAward = (awardData: Vip.VipLevelAwardData) => {
      vipLevelAward.value = awardData
    }

    // Storage coding rebate  存储打码返利
    const setVipBetawardList = (list: Vip.vipBetawardListData) => {
      vipBetawardList.value = list
    }

    // Reward collection prompt information  奖励领取提示信息
    const alertMessage = (
      successMessage: Vip.SuccessMessageParams,
      message?: string,
    ) => {
      // If using Nuxt UI Pro, uncomment and use toast:
      // toast.add({
      //     title: successMessage.message,
      //     icon: successMessage.type == 1 ? 'i-heroicons-check-circle' : 'i-heroicons-exclamation-circle', // Example icons
      //     color: successMessage.type == 1 ? 'green' : 'red',
      //     timeout: 3000,
      // });
      // Otherwise, implement your custom notification logic here
      const text = message || successMessage.message
      console.log('Alert Message:', text, 'Type:', successMessage.type) // Placeholder
    }

    // Get VIP check-in content
    async function dispatchVipSignIn() {
      setSuccess(false)
      const route: string = NETWORK_CONFIG.VIP_INFO.VIP_SIGNIN
      const network: Network = Network.getInstance()

      const next = (response: Vip.GetVipSignInResponse) => {
        if (response.code == 200) {
          setSuccess(true)
          setVipSignIn(response.data)
        } else {
          setErrorMessage(handleException(response.code))
        }
      }
      await network.sendMsg(route, {}, next, 1, 4)
    }

    async function dispatchVipSigninawardReceive() {
      setSuccess(false)
      const route: string = NETWORK_CONFIG.VIP_INFO.VIP_SIGNINAWARD_RECEIVE
      const network: Network = Network.getInstance()

      const next = (response: any) => {
        // Note: response type is 'any' in original
        if (response.code == 200) {
          setSuccess(true)
          dispatchVipSignIn() // Call the action
        } else {
          setErrorMessage(handleException(response.code))
        }
      }
      await network.sendMsg(route, {}, next, 1)
    }

    // Receive VIP sign-in rewards
    async function dispatchVipSignInReward() {
      setSuccess(false)
      const route: string = NETWORK_CONFIG.VIP_INFO.VIP_SIGNIN_REWARDS
      const network: Network = Network.getInstance()

      const next = (response: any) => {
        // Note: response type is 'any' in original
        if (response.code == 200) {
          setSuccess(true)
        } else {
          setErrorMessage(handleException(response.code))
        }
      }
      await network.sendMsg(route, {}, next, 1)
    }

    // user vip information api
    async function dispatchVipInfo() {
      setSuccess(false)
      const route: string = NETWORK_CONFIG.VIP_INFO.USER_VIP_INFO
      const network: Network = Network.getInstance()

      const next = (response: Vip.GetVipInfoResponse) => {
        if (response.code == 200) {
          setSuccess(true)
          setVipInfo(response.data)
        } else {
          setErrorMessage(handleException(response.code))
        }
      }
      await network.sendMsg(route, {}, next, 1, 4)
    }

    // user vip level api
    async function dispatchVipLevels() {
      setSuccess(false)
      const route: string = NETWORK_CONFIG.VIP_INFO.USER_VIP_LEVEL
      const network: Network = Network.getInstance()

      const next = (response: Vip.GetVipLevelResponse) => {
        if (response.code == 200) {
          setSuccess(true)
          setVipLevels(response.data)
        } else {
          setErrorMessage(handleException(response.code))
        }
      }
      await network.sendMsg(route, {}, next, 1, 4)
    }

    // user vip task api
    async function dispatchVipTasks() {
      setSuccess(false)
      const route: string = NETWORK_CONFIG.VIP_INFO.VIP_TASKS
      const network: Network = Network.getInstance()

      const next = (response: Vip.GetVipTaskResponse) => {
        if (response.code == 200) {
          setSuccess(true)
          setVipTasks(response.data)
        } else {
          setErrorMessage(handleException(response.code))
        }
      }
      await network.sendMsg(route, {}, next, 1, 4)
    }

    // receive VIP code rebate rewards
    async function dispatchVipRebateAward(data: any) {
      // Keeping 'any' type as in original
      setSuccess(false)
      const route: string = NETWORK_CONFIG.VIP_INFO.VIP_REBATE_AWARD
      const network: Network = Network.getInstance()

      const next = (response: Vip.GetVipRebateAwardResponse) => {
        if (response.code == 200) {
          setSuccess(true)
        } else {
          setErrorMessage(handleException(response.code))
        }
      }
      await network.sendMsg(route, data, next, 1)
    }

    // get vip coding record
    async function dispatchVipRebateHistory(data: Vip.VipRebateHistoryRequest) {
      setSuccess(false)
      const route: string = NETWORK_CONFIG.VIP_INFO.VIP_REBATE_HISTORY
      const network: Network = Network.getInstance()

      const next = (response: Vip.GetVipRebateHistoryResponse) => {
        if (response.code == 200) {
          setSuccess(true)
          setVipRebateHistory(response.data)
        } else {
          setErrorMessage(handleException(response.code))
        }
      }
      await network.sendMsg(route, data, next, 1)
    }

    // Obtain VIP level reward record
    async function dispatchVipLevelRewardHistory(
      data: Vip.VipLevelRewardHistoryRequest,
    ) {
      setSuccess(false)
      const route: string = NETWORK_CONFIG.VIP_INFO.VIP_LEVEL_AWARD_HISTORY
      const network: Network = Network.getInstance()

      const next = (response: Vip.GetVipLevelRewardHistoryResponse) => {
        if (response.code == 200) {
          setSuccess(true)
          setVipLevelRewardHistory(response.data)
        } else {
          setErrorMessage(handleException(response.code))
        }
      }
      await network.sendMsg(route, data, next, 1)
    }

    // Get VIP weekly and monthly reward records
    async function dispatchVipTimesHistory(data: Vip.VipTimesHistoryRequest) {
      setSuccess(false)
      const route: string = NETWORK_CONFIG.VIP_INFO.VIP_TIMES_HISTORY
      const network: Network = Network.getInstance()

      const next = (response: Vip.GetVipTimesHistoryResponse) => {
        if (response.code == 200) {
          setSuccess(true)
          setVipTimesHistory(response.data)
        } else {
          setErrorMessage(handleException(response.code))
        }
      }
      await network.sendMsg(route, data, next, 1)
    }

    // Get VIP upgrade reward information
    async function dispatchVipLevelUpList() {
      setSuccess(false)
      const route: string = NETWORK_CONFIG.VIP_INFO.VIP_LEVELUP_LIST
      const network: Network = Network.getInstance()

      const next = (response: Vip.GetVipLevelUpListResponse) => {
        if (response.code == 200) {
          setSuccess(true)
          setVipLevelUpList(response.data)
        } else {
          setErrorMessage(handleException(response.code))
        }
      }
      await network.sendMsg(route, {}, next, 1, 4)
    }

    // Receive VIP upgrade rewards
    async function dispatchVipLevelUpReceive() {
      setSuccess(false)
      const route: string = NETWORK_CONFIG.VIP_INFO.VIP_LEVELUP_RECEIVE
      const network: Network = Network.getInstance()

      const next = (response: Vip.GetVipLevelUpReceiveResponse) => {
        if (response.code == 200) {
          setSuccess(true)
          setVipLevelUpReceive(response.data)
        } else {
          setErrorMessage(handleException(response.code))
        }
      }
      await network.sendMsg(route, {}, next, 1)
    }

    /**
     * Get periodic rewards  获取周期性奖励
     */
    async function dispatchVipCycleawardList() {
      setSuccess(false)
      const route: string = NETWORK_CONFIG.VIP_INFO.USER_VIP_CYCLEAWARD_LIST
      const network: Network = Network.getInstance()

      const next = (response: Vip.GetVipLevelAwardResponse) => {
        // Note: response type is Vip.GetVipLevelAwardResponse in original, check if correct
        if (response.code == 200) {
          setSuccess(true)
          setVipCycleawardList(response.data)
        } else {
          setErrorMessage(handleException(response.code))
        }
      }
      await network.sendMsg(route, {}, next, 1, 4)
    }

    /**
     * Receive periodic rewards  领取周期性奖励
     * @param data Reward type 1: Member day 2: Daily reward 3: Weekly reward 4: Monthly reward
     * @param data 领取奖励类型 1: 会员日 2: 日奖励 3:周奖励 4: 月奖励
     */
    async function dispatchVipCycleawardReceive(
      data: Vip.VipCycleawardReceiveRequest,
    ) {
      setSuccess(false)
      const route: string = NETWORK_CONFIG.VIP_INFO.USER_VIP_CYCLEAWARD_RECEIVE
      const network: Network = Network.getInstance()

      const next = (response: Vip.GetVipLevelAwardResponse) => {
        // Note: response type is Vip.GetVipLevelAwardResponse in original, check if correct
        if (response.code == 200) {
          setSuccess(true)
          alertMessage(
            {
              type: 1,
              message: '',
            },
            'reward.success_text',
          )
          dispatchVipCycleawardList() // Call the action
        } else {
          setErrorMessage(handleException(response.code))
          alertMessage(
            {
              type: 0,
              message: '',
            },
            response.message,
          )
        }
      }
      await network.sendMsg(route, data, next, 1)
    }

    /**
     * Get level-related rewards  获取等级相关奖励
     */
    async function dispatchVipLevelAward() {
      setSuccess(false)
      const route: string = NETWORK_CONFIG.VIP_INFO.VIP_LEVEL_AWARD
      const network: Network = Network.getInstance()

      const next = (response: Vip.GetVipLevelAwardResponse) => {
        // Note: response type is Vip.GetVipLevelAwardResponse in original, check if correct
        if (response.code == 200) {
          setSuccess(true)
          setVipLevelAward(response.data)
        } else {
          setErrorMessage(handleException(response.code))
        }
      }
      await network.sendMsg(route, {}, next, 1, 4)
    }

    /**
     * Receive level-related rewards  领取等级相关奖励
     * @param data Reward type 5: Upgrade reward 6: Upgrade reward
     * @param data 领取奖励类型 5: 升级奖励 6: 升段奖励
     */
    async function dispatchVipLevelAwardReceive(
      data: Vip.VipLevelAwardReceiveRequest,
    ) {
      setSuccess(false)
      const route: string = NETWORK_CONFIG.VIP_INFO.USER_VIP_LEVELAWARD_RECEIVE
      const network: Network = Network.getInstance()

      const next = (response: Vip.GetVipLevelAwardResponse) => {
        // Note: response type is Vip.GetVipLevelAwardResponse in original, check if correct
        if (response.code == 200) {
          setSuccess(true)
          alertMessage(
            {
              type: 1,
              message: '',
            },
            'reward.success_text',
          )
          dispatchVipLevelAward() // Call the action
        } else {
          setErrorMessage(handleException(response.code))
          alertMessage(
            {
              type: 0,
              message: '',
            },
            response.message,
          )
        }
      }
      await network.sendMsg(route, data, next, 1)
    }

    /**
     * Get coding rebates  获取打码返利
     */
    async function dispatchVipBetawardList() {
      setSuccess(false)
      const route: string = NETWORK_CONFIG.VIP_INFO.USER_VIP_BETAWARD_LIST
      const network: Network = Network.getInstance()

      const next = (response: Vip.GetVipLevelAwardResponse) => {
        // Note: response type is Vip.GetVipLevelAwardResponse in original, check if correct
        if (response.code == 200) {
          setSuccess(true)
          setVipBetawardList(response.data)
        } else {
          setErrorMessage(handleException(response.code))
        }
      }
      await network.sendMsg(route, {}, next, 1, 4)
    }

    /**
     * Get coding rebates  领取打码返利
     * @param data Reward type 7: Coding rewards
     * @param data 领取奖励类型 7: 打码奖励
     */
    async function dispatchVipBetawardReceive(
      data: Vip.VipBetawardReceiveRequest,
    ) {
      setSuccess(false)
      const route: string = NETWORK_CONFIG.VIP_INFO.USER_VIP_BETAWARD_RECEIVE
      const network: Network = Network.getInstance()

      const next = (response: Vip.GetVipLevelAwardResponse) => {
        // Note: response type is Vip.GetVipLevelAwardResponse in original, check if correct
        if (response.code == 200) {
          setSuccess(true)
          alertMessage(
            {
              type: 1,
              message: '',
            },
            'reward.success_text',
          )
          dispatchVipBetawardList() // Call the action
        } else {
          setErrorMessage(handleException(response.code))
          alertMessage(
            {
              type: 0,
              message: '',
            },
            response.message,
          )
        }
      }
      await network.sendMsg(route, data, next, 1)
    }

    // Return all state, getters, and actions
    return {
      success,
      errMessage,
      levelUpDialogVisible,
      vipInfo,
      vipLevels,
      vipTasks,
      vipRebateHistory,
      vipLevelRewardHistory,
      vipTimesHistory,
      vipSignIn,
      vipLevelUpList,
      vipLevelUpReceive,
      vipNavBarToggle,
      vipCycleawardList,
      vipLevelAward,
      vipBetawardList,

      getSuccess,
      getErrMessage,
      getVipInfo,
      getVipLevels,
      getVipTasks,
      getVipRebateHistory,
      getVipLevelRewardHistory,
      getVipTimesHistory,
      getVipSignIn,
      getLevelUpDialogVisible,
      getVipLevelUpList,
      getVipLevelUpReceive,
      getVipNavBarToggle,
      getVipCycleawardList,
      getVipLevelAward,
      getVipBetawardList,

      setSuccess,
      setErrorMessage,
      setVipInfo,
      setVipLevels,
      setVipTasks,
      setVipRebateHistory,
      setVipLevelRewardHistory,
      setVipTimesHistory,
      setVipSignIn,
      setLevelUpDialogVisible,
      setVipLevelUpList,
      setVipLevelUpReceive,
      setVipNavBarToggle,
      setVipCycleawardList,
      setVipLevelAward,
      setVipBetawardList,
      alertMessage,
      dispatchVipSignIn,
      dispatchVipSigninawardReceive,
      dispatchVipSignInReward,
      dispatchVipInfo,
      dispatchVipLevels,
      dispatchVipTasks,
      dispatchVipRebateAward,
      dispatchVipRebateHistory,
      dispatchVipLevelRewardHistory,
      dispatchVipTimesHistory,
      dispatchVipLevelUpList,
      dispatchVipLevelUpReceive,
      dispatchVipCycleawardList,
      dispatchVipCycleawardReceive,
      dispatchVipLevelAward,
      dispatchVipLevelAwardReceive,
      dispatchVipBetawardList,
      dispatchVipBetawardReceive,
    }
  },
  {
    persist: true,
  },
)

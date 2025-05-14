import { VipInfo as IVipInfo } from "../index";

export interface GetVIPData {
  id: number;
  totalDepositAmount: number;
  currentDepositAmount: number;
  totalWagerAmount: number;
  currentWagerAmount: number;
  vipGrade: string;
  vipRate: number;
}

export interface GetSpinData {
  id: number;
  image: any;
  title: string;
  content: string;
}

export interface GetRouletteHistory {
  id: number;
  rouletteTime: string;
  user: string;
  rouletteResult: string;
}

// export interface VipInfo {
//   id: string
//   level: number
//   deposit_exp: number
//   bet_exp: number
//   rank_bet_exp: number
//   rank_deposit_exp: number
//   rank_name: string
//   icon: string
//   exp_switch_type: number
//   now_deposit_exp: string
//   level_deposit_exp: string
//   now_bet_exp: string
//   level_bet_exp: string
//   telegram: string
//   is_protection: boolean
//   protection_deposit_exp: string
//   protection_deposit_amount: string
//   protection_bet_exp: string
//   protection_bet_amount: string
//   protection_days: number
//   protection_switch: number
//   cycle_award_switch: boolean
//   level_award_switch: boolean
//   signin_award_switch: boolean
//   bet_award_switch: boolean
//   withdrawal_award_switch: boolean
//   unprotection_deposit_exp: string
//   unprotection_deposit_amount: string
//   unprotection_bet_exp: string
//   unprotection_bet_amount: string
//   unprotection_days: number
//   unprotection_switch: number
//   main_currency: string
//   can_receive_level_award: boolean
//   can_receive_rank_award: boolean
//   can_receive_day_award: boolean
//   can_receive_week_award: boolean
//   can_receive_month_award: boolean
//   can_receive_signin_award: boolean
//   can_receive_bet_award: boolean
//   can_receive_withdrawal_award: boolean
//   userid: string
//   free_spin_times: number
//   week_gift: number
//   month_gift: number
//   upgrade_gift: number
//   now_cash_back: number
//   yesterday_cash_back: number
//   history_cash_back: number
//   gamesession?: any[]
//   operator?: any
//   user_profile_userIdTouser?: any
//   tournamententry?: any[]
//   transactions?: any[]
// }

export interface VipLevel {
  level: number;
  rank_id: number;
  protection_conditions: number;
  deposit_exp: number;
  bet_exp: number;
  free_spins_times: number;
  uprank_award: number;
  week_award: number;
  withdrawals_amonut: number;
  withdrawal_times: number;
  month_withdrawals_amount: number;
  month_withdrawals_times: number;
  month_award: number;
  free_withdrawals: number;
  free_withdrawals_times: number;
  withdrawal_fee: number;
  bet_award_rate: any;
  signin_award: Array<any>;
  tasks_max: number;
  deposit_rate: number;
  bet_rate: number;
  availabe_daily_bonus_time: string;
  collectable_week_bonus_day: string | number;
  collectable_month_bonus_day: string | number;
}

export interface VipTaskItem {
  index: number;
  task_id: number;
  task_type: number;
  task_terms: {
    terms_id: number;
    deposit: number;
    bet: number;
    game_type: string;
    game_tag: string;
    times: number;
    multiplier: number;
    game_win: number;
  };
  state: number;
  award: number;
}

export interface VipRebateHistoryItem {
  notes_id: string | number;
  created_at: string | number;
  amount: string | number;
  cash_back: string | number;
  vip_level: string | number;
  vip_rate: string | number;
  game_type: string;
}

export interface VipRebateHistoryData {
  total: number;
  list: Array<VipRebateHistoryItem>;
}

export interface VipRebateHistoryRequest {
  page_num: number;
  page_size: number;
  start_time: number;
}

export interface VipLevelRewardHistoryItem {
  notes_id: string | number;
  created_at: string | number;
  amount: string | number;
  vip_level: string | number;
  type: string;
}

export interface VipLevelRewardHistoryData {
  total: number;
  list: Array<VipLevelRewardHistoryItem>;
}

export interface VipLevelRewardHistoryRequest {
  page_num: number;
  page_size: number;
  start_time: number;
}

export interface VipTimesHistoryItem {
  notes_id: string | number;
  created_at: string | number;
  amount: string | number;
  vip_level: string | number;
  type: string;
}

export interface VipTimesHistoryData {
  total: number;
  list: Array<VipTimesHistoryItem>;
}

export interface VipTimesHistoryRequest {
  index: number;
  page_num: number;
  page_size: number;
  start_time: number;
}

export interface VipSignInData {
  award: Array<string | number>;
  signin_day: number;
  is_signin: number;
  limited_bet: number;
  limited_deposit: number;
  vip_level: number;
}

export interface VipLevelUpListData {
  level: number;
  upgreadegift: number;
  upgrade_award: number;
}

export interface VipLevelUpReceiveData {
  win_award: number;
  lose_award: Array<number>;
}

export type GetVipLevelUpListResponse = {
  code: number;
  data: VipLevelUpListData;
  message: string;
};

export type GetVipLevelUpReceiveResponse = {
  code: number;
  data: VipLevelUpReceiveData;
  message: string;
};

export type GetVipSignInResponse = {
  code: number;
  data: VipSignInData;
  message: string;
};

export type GetVipInfoResponse = {
  code: number;
  data: IVipInfo;
  message: string;
};

export type GetVipLevelResponse = {
  code: number;
  data: Array<VipLevel>;
  message: string;
};

export type GetVipTaskResponse = {
  code: number;
  data: Array<VipTaskItem>;
  message: string;
};

export type GetVipLevelAwardResponse = {
  code: number;
  data: any;
  message: string;
};

export type GetVipRebateAwardResponse = {
  code: number;
  data: any;
  message: string;
};

export type GetVipRebateHistoryResponse = {
  code: number;
  data: VipRebateHistoryData;
  message: string;
};

export type GetVipLevelRewardHistoryResponse = {
  code: number;
  data: VipLevelRewardHistoryData;
  message: string;
};

export type GetVipTimesHistoryResponse = {
  code: number;
  data: VipTimesHistoryData;
  message: string;
};

export type VipCycleawardListData = {
  membership_day_gift: number;
  day_gift: number;
  week_gift: number;
  month_gift: number;
};

export type VipCycleawardReceiveRequest = {
  type: number;
};

export type VipLevelAwardData = {
  level_up_num: number;
  level: number;
  upgrade_gift: number;
  rank_up_num: number;
  rank: number;
  uprank_gift: number;
};

export type VipLevelAwardReceiveRequest = {
  type: number;
};

export type vipBetawardListData = {
  now_cash_back: string;
  yesterday_cash_back: string;
  history_cash_back: string;
};

export type VipBetawardReceiveRequest = {
  type: number;
};

export type SuccessMessageParams = {
  message: string;
  type: number;
};

/**
 * Represents a VIP Benefit.
 * Based on the Prisma 'VipBenefit' model.
 */
export interface VipBenefit {
  id: string;
  level: number; // The VIP level this benefit applies to
  name: string; // e.g., "Weekly Cashback", "Dedicated Support"
  description: string;
  type: string; // e.g., 'CASHBACK', 'BONUS', 'FREE_SPINS', 'SUPPORT_LEVEL'
  value: number; // e.g., for 10% cashback, value might be 10
  value_type: string; // e.g., 'PERCENTAGE', 'FIXED_AMOUNT', 'SERVICE_TIER'
  // is_claimable: boolean; // If the benefit needs to be actively claimed
  // claim_frequency?: string | null; // e.g., 'DAILY', 'WEEKLY', 'MONTHLY', 'ONE_TIME'
  created_at: Date;
  updated_at: Date;
}
// Suggested location: packages/types/src/interface/vip.ts
// (Assuming VipBenefitId is a string, typically a UUID or CUID)
export interface ClientClaimVipRewardPayload {
  benefit_id: string; // The unique identifier of the VIP benefit to be claimed.
}

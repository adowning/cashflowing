import {
  GetVipInfoResponse,
  GetVipLevelAwardResponse,
  GetVipLevelResponse,
  VipInfo,
  VipLevel,
  VipLevelAwardData,
} from '@cashflow/types'

/*
{
    "code": 200,
    "data": {
        "rank_name": "VIP0",
        "icon": "upload/vip_image/img_vipemblem_0_20241025041515.png",
        "exp_switch_type": 2,
        "level": 0,
        "deposit_exp": "0",
        "rank_deposit_exp": "0",
        "now_deposit_exp": "0",
        "level_deposit_exp": "0",
        "bet_exp": "0",
        "rank_bet_exp": "0",
        "now_bet_exp": "0",
        "level_bet_exp": "0",
        "telegram": "333",
        "is_protection": false,
        "protection_deposit_exp": "0",
        "protection_deposit_amount": "0",
        "protection_bet_exp": "0",
        "protection_bet_amount": "0",
        "protection_days": 30,
        "protection_switch": 0,
        "cycle_award_switch": true,
        "level_award_switch": true,
        "signin_award_switch": true,
        "bet_award_switch": true,
        "withdrawal_award_switch": true,
        "unprotection_deposit_exp": "0",
        "unprotection_deposit_amount": "0",
        "unprotection_bet_exp": "0",
        "unprotection_bet_amount": "0",
        "unprotection_days": 3,
        "unprotection_switch": 0,
        "main_currency": "MXN",
        "can_receive_level_award": false,
        "can_receive_rank_award": false,
        "can_receive_day_award": false,
        "can_receive_week_award": true,
        "can_receive_month_award": false,
        "can_receive_signin_award": false,
        "can_receive_bet_award": false,
        "can_receive_withdrawal_award": false
    },
    "link": "",
    "message": "Operation successful",
    "method": 1
}
    */
export async function getVipLevels() {
  const list: VipLevel = {
    level: 0,
    rank_id: 0,
    protection_conditions: 0,
    deposit_exp: 0,
    bet_exp: 0,
    free_spins_times: 0,
    uprank_award: 0,
    week_award: 0,
    withdrawals_amonut: 0,
    withdrawal_times: 0,

    month_withdrawals_amount: 0,
    month_withdrawals_times: 0,
    month_award: 0,
    free_withdrawals: 0,
    free_withdrawals_times: 0,
    withdrawal_fee: 0,
    bet_award_rate: undefined,
    signin_award: [],
    tasks_max: 0,
    deposit_rate: 0,
    bet_rate: 0,
    availabe_daily_bonus_time: '',
    collectable_week_bonus_day: '',
    collectable_month_bonus_day: '',
  }

  const response: GetVipLevelResponse = {
    code: 200,
    data: [list],
    message: 'no fkin clue',
  }

  return new Response(JSON.stringify(response))
}

export async function getVipInfo() {
  const list: VipInfo = {
    level: 0,
    deposit_exp: 0,
    bet_exp: 0,
    rank_bet_exp: 100,
    rank_deposit_exp: 0,
    // free_spin_times: 0,
    // week_gift: 0,
    // month_gift: 0,
    // upgrade_gift: 0,
    // now_cash_back: 0,
    // yesterday_cash_back: 0,
    // history_cash_back: 0,
    rank_name: 'VIP0',
    icon: 'upload/vip_image/img_vipemblem_0_20241025041515.png',
    exp_switch_type: 2,
    now_deposit_exp: '0',
    level_deposit_exp: '0',
    now_bet_exp: '0',
    level_bet_exp: '0',
    telegram: '333',
    is_protection: false,
    protection_deposit_exp: '0',
    protection_deposit_amount: '0',
    protection_bet_exp: '0',
    protection_bet_amount: '0',
    protection_days: 30,
    protection_switch: 0,
    cycle_award_switch: true,
    level_award_switch: true,
    signin_award_switch: true,
    bet_award_switch: true,
    withdrawal_award_switch: true,
    unprotection_deposit_exp: '0',
    unprotection_deposit_amount: '0',
    unprotection_bet_exp: '0',
    unprotection_bet_amount: '0',
    unprotection_days: 3,
    unprotection_switch: 0,
    main_currency: 'MXN',
    can_receive_level_award: false,
    can_receive_rank_award: false,
    can_receive_day_award: false,
    can_receive_week_award: true,
    can_receive_month_award: false,
    can_receive_signin_award: false,
    can_receive_bet_award: false,
    can_receive_withdrawal_award: false,
    userid: '',
    id: '',
    free_spin_times: null,
    week_gift: null,
    month_gift: null,
    upgrade_gift: null,
    now_cash_back: null,
    yesterday_cash_back: null,
    history_cash_back: null,
    gamesession: [],
    // operator: undefined,s
    transactions: [],
    user: null,
    operatorId: '',
    operator: null,
  }

  const response: GetVipInfoResponse = {
    code: 200,
    data: list,
    message: 'no fkin clue',
  }

  return new Response(JSON.stringify(response))
}

export async function getVipLevelAward() {
  const list: VipLevelAwardData = {
    level_up_num: 0,
    level: 0,
    upgrade_gift: 0,
    rank_up_num: 0,
    rank: 0,
    uprank_gift: 0,
  }

  const response: GetVipLevelAwardResponse = {
    code: 200,
    data: list,
    message: 'no fkin clue',
  }

  return new Response(JSON.stringify(response))
}
// export async function vipRoutes(req: BunRequest, route: string) {
//   const user = await getUserFromHeader(req);
//   if (route === NETWORK_CONFIG.WEB_SOCKET.SOCKET_CONNECT) return false;

//   if (!user || !user.activeProfile) {
//     return new Response(
//       JSON.stringify({
//         code: 401,
//         message: "Unauthorized: ",
//         data: { total_pages: 0, record: [] },
//       }),
//       { status: 401 }
//     );
//   }
//   try {
//     switch (route) {
//       case NETWORK_CONFIG.VIP_INFO.USER_VIP_INFO:
//         return await getVipInfo();
//       case NETWORK_CONFIG.VIP_INFO.USER_VIP_LEVEL:
//         return await getVipLevels();
//       case NETWORK_CONFIG.VIP_INFO.VIP_LEVEL_AWARD:
//         return await getVipLevelAward();
//       default:
//         return false; ///new Response(JSON.stringify({ message: "Route not found", code: 404 }), { status: 404 });
//     }
//   } catch (error) {
//     console.log(error);
//     return new Response(JSON.stringify({ message: `Internal server error: ${error}`, code: 500 }), {
//       status: 500,
//     });
//   }
// }

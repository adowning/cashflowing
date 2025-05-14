import { NETWORK_CONFIG, User } from '@cashflow/types'
import {
  GetCurrencyBalanceList,
  GetCurrencyBalanceListResponse,
} from '@cashflow/types'
import { HonoRequest } from 'hono'

export async function getCurrencyList(req: HonoRequest, user: User) {
  const list: GetCurrencyBalanceList = {
    amount: user.activeProfile.balance.toString(),
    availabe_balance: user.activeProfile.balance.toString(),
    real: user.activeProfile.balance.toString(),
    bonus: user.activeProfile.balance.toString(),
    currency: user.activeProfile.balance.toString(),
  }

  const response: GetCurrencyBalanceListResponse = {
    code: 200,
    data: [list],
    message: 'no fkin clue',
  }

  return new Response(JSON.stringify(response))
}

import { User } from 'better-auth/types'
import createRouter from '../rest/create-router'
import {
  createDeposit,
  getDepositHistory,
  getDepositMethods,
} from '../services/transactions/deposit'
import { NETWORK_CONFIG } from '@cashflow/types'

const router = createRouter()

router.get(NETWORK_CONFIG.LOGIN.LOGIN, async (c) => {
  const user = c.get('user') as Partial<User>
  return await getDepositMethods(c.req, user)
})

router.get(NETWORK_CONFIG.LOGIN.REGISTER, async (c) => {
  const user = c.get('user') as User
  return await getDepositHistory(c.req, user)
})

router.post(NETWORK_CONFIG.LOGIN.ME, async (c) => {
  const user = c.get('user') as User
  return await createDeposit(c.req, user)
})

export default router

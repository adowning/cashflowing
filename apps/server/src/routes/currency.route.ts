import { NETWORK_CONFIG, User } from '@cashflow/types'
import createRouter from '../rest/create-router'
import { getCurrencyList } from '../services/currency.service'

const router = createRouter()
router.get(NETWORK_CONFIG.CURRENCY.CURRENCY_LIST, async (c) => {
  const user = c.get('user') as User
  return await getCurrencyList(c.req, user)
})

export default router

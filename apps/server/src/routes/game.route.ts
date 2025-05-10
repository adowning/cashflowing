import { NETWORK_CONFIG } from '@cashflow/types'
import createRouter from '../rest/create-router'
import {
  getGameList,
  getGameGameCategory,
  getGameSearch,
  getGameEnter,
  getGameUserGame,
  getGameFavoriteGameList,
  getGameHistory,
  getGameBigWin,
  getGameSpin,
  getGameSpinPage,
  getGameFavoriteGame,
} from '../services/game.service'

const router = createRouter()
router.get(NETWORK_CONFIG.GAME_INFO.GAME_LIST, async (c) => {
  return await getGameList(c.req)
})
router.get(NETWORK_CONFIG.GAME_INFO.GAME_CATEGORY, async (c) => {
  return await getGameGameCategory(c.req)
})
router.get(NETWORK_CONFIG.GAME_INFO.GAME_SEARCH, async (c) => {
  return await getGameSearch(c.req)
})
router.get(NETWORK_CONFIG.GAME_INFO.GAME_ENTER, async (c) => {
  return await getGameEnter(c.req, c.get('user')!)
})
router.get(NETWORK_CONFIG.GAME_INFO.USER_GAME, async (c) => {
  return await getGameUserGame(c.req)
})
router.get(NETWORK_CONFIG.GAME_INFO.FAVORITE_GAME, async (c) => {
  return await getGameFavoriteGame(c.req, c.get('user')!)
})
router.get(NETWORK_CONFIG.GAME_INFO.FAVORITE_GAME_LIST, async (c) => {
  return await getGameFavoriteGameList(c.req)
})
router.get(NETWORK_CONFIG.GAME_INFO.GAME_HISTORY, async (c) => {
  return await getGameHistory(c.req, c.get('user')!)
})
router.get(NETWORK_CONFIG.GAME_INFO.GAME_BIGWIN, async (c) => {
  return await getGameBigWin(c.req)
})
router.get(NETWORK_CONFIG.GAME_INFO.SPIN, async (c) => {
  return await getGameSpin(c.req)
})
router.get(NETWORK_CONFIG.GAME_INFO.SPINPAGE, async (c) => {
  return await getGameSpinPage(c.req)
})

export default router

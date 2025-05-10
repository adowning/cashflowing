import { PrismaClient } from '../prisma/client'
import * as gamesData from './games2.json'

const prisma = new PrismaClient()
export async function loadGames() {
  await prisma.$connect()
  console.log('loading games')
  const _games = []
  // const data = await import(__dirname + '/games2.json')
  async function insertGames(gamesData) {
    await prisma.game.createMany({
      data: gamesData,
      skipDuplicates: true,
    })
  }
  const shops = await prisma.operator.findMany()
  const shop = shops[0]
  //   shops.forEach((shop) => {
  for (const _game of gamesData.default) {
    const injpg = Math.random() > 0.7
    const jpgnum = Math.floor(Math.random() * 3)
    const game = _game
    //   let jpgId = null
    //   if (injpg) {
    //     jpgId = jackpotGroups[jpgnum].id
    //   }
    game.operatorId = shop.id
    delete game.shop_id
    delete game.type
    //   game.jackpotGroupId = jpgId != null ? jpgId : undefined
    delete game.jpg_id
    delete game.label
    delete game.device
    delete game.id
    game.vipLevel = parseInt(game.vip_level) || 0
    game.rezerv = parseInt(game.rezerv) || 0
    game.cask = parseInt(game.cask) || 0
    game.bet = parseInt(game.bet) || 0
    game.bids = parseInt(game.bids) || 0
    game.view = parseInt(game.view) || 0
    game.statIn = parseInt(game.stat_in) || 0
    game.statOut = parseInt(game.stat_out) || 0
    // game.createdAt = parseInt(game.created_at);
    // game.updatedOff = parseInt(game.updated_off);
    // game.updatedAt = new Date(game.updated_at);
    game.standardRtp = parseInt(game.standard_rtp) || 0
    game.originalId = parseInt(game.original_id) || 0
    game.denomination = parseInt(game.denomination) || 1
    game.popularity = parseInt(game.popularity) || 0
    game.currentRtp = parseInt(game.current_rtp) || 0
    game.rtpStatIn = parseInt(game.rtp_stat_in) || 0
    game.rtpStatOut = parseInt(game.rtp_stat_out) || 0
    delete game.created_at
    delete game.updated_at
    delete game.updated_off
    delete game.standard_rtp
    delete game.updated_off
    // game.category_temp = parseInt(game.category_temp);
    game.linesPercentConfigSpin = game.lines_percent_config_spin
    game.linesPercentConfigSpinBonus = game.lines_percent_config_spin_bonus
    game.linesPercentConfigBonus = game.lines_percent_config_bonus
    game.linesPercentConfigBonusBonus = game.lines_percent_config_bonus_bonus
    game.linesPercentConfigBonusBonus =
      game.lines_percent_config_spin_bonus_bonus
    delete game.original_id
    delete game.stat_in
    delete game.stat_out

    delete game.lines_percent_config_spin
    delete game.lines_percent_config_bonus_bonus
    delete game.lines_percent_config_spin_bonus
    delete game.lines_percent_config_spin_bonus_bonus
    delete game.lines_percent_config_bonus
    game.scaleMode = game.scalemode
    delete game.scalemode
    game.slotViewState = game.slotviewstate
    delete game.slotviewstate
    delete game.category_temp
    delete game.category_temp
    delete game.updated_off
    delete game.current_rtp
    delete game.rtp_stat_in
    delete game.rtp_stat_out
    delete game.vip_level
    game.isActive = false
    delete game.active
    game.featured = Math.floor(Math.random() * 100) < 10 ? true : false
    if (game.developer === 'nolimit') game.featured = true
    if (game.developer === 'BigFishGames') game.featured = false
    // _games.push(game);
    if (_games.filter((item) => item.name == game.name).length == 0)
      _games.push(game)
  }
  //   })
  const feats = _games.filter((item) => item.featured == true)
  await insertGames(_games)
  return await prisma.game.findMany()
}
// await loadGames();

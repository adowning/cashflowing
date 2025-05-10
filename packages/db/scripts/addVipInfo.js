// const { ConsoleLogger } = require("@nestjs/common");
const { PrismaClient } = require('../prisma/client')
const prisma = new PrismaClient()

/*
{
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
    */
export async function addVipInfo(operatorId) {
  //////console.log('Products seed');
  const users = await prisma.user.findMany()
  //////console.log('shop count ', shops.length);
  console.log(users)
  for await (const user of users) {
    console.log(user.vipInfo)
    if (user.vipInfo !== undefined) continue

    //console.log(products.default)
    // for (var product of products.default) {
    //   product.shopId = shop.id;
    //   product.totalDiscountInCents = 0;
    //   delete product.shop_id;
    //   // product.id = ulid()
    // }
    await prisma.vipInfo.create({
      data: {
        // userId: user.id,
        operatorId: operatorId,
        rank_name: 'VIP0',
        icon: 'upload/vip_image/img_vipemblem_0_20241025041515.png',
        exp_switch_type: 2,
        level: 0,
        deposit_exp: 0,
        rank_deposit_exp: 0,
        now_deposit_exp: '0',
        level_deposit_exp: '0',
        bet_exp: 0,
        rank_bet_exp: 0,
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
      },
    })
  }
  // await prisma.product.createMany({ data: { ...products } })
  //   for await (const product of products.default) {
  ////console.log(product)
  // await prisma.product.create({ data: { ...product } });
  //   }
}

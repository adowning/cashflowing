import { OK } from "stoker/http-status-codes";

import {
  getVipInfo,
  getVipLevels,
  getVipLevelAward,
} from "../services/vip.service";
import { NETWORK_CONFIG } from "@cashflow/types";
import createRouter from "../create-router";

const router = createRouter();
router.get(NETWORK_CONFIG.VIP_INFO.USER_VIP_INFO, async (c) => {
  return await getVipInfo();
});
router.get(NETWORK_CONFIG.VIP_INFO.USER_VIP_LEVEL, async (c) => {
  return await getVipLevels();
});
router.get(NETWORK_CONFIG.VIP_INFO.VIP_LEVEL_AWARD, async (c) => {
  return await getVipLevelAward();
});

export default router;

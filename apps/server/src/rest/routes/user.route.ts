import { OK } from "stoker/http-status-codes";
import {
  checkUser,
  getUserAmount,
  getUserBalance,
  getUserInfo,
  setUserCurrency,
  suspendUser,
  updateUserCashtag,
  updateUserEmail,
  updateUserInfo,
  updateUserPassword,
  verifyUserEmail,
} from "../services/user.service";
import { NETWORK_CONFIG } from "@cashflow/types";
import createRouter from "../create-router";

const router = createRouter();
router.get(NETWORK_CONFIG.PERSONAL_INFO_PAGE.USER_AMOUNT, async (c) => {
  return await getUserAmount(c.req, c.get("user")!);
});
router.get(NETWORK_CONFIG.PERSONAL_INFO_PAGE.USER_INFO, async (c) => {
  return await getUserInfo(c.req, c.get("user")!);
});
router.get(NETWORK_CONFIG.PERSONAL_INFO_PAGE.USER_BALANCE, async (c) => {
  return await getUserBalance(c.req, c.get("user")!);
});
router.get(NETWORK_CONFIG.PERSONAL_INFO_PAGE.SET_USER_CURRENCY, async (c) => {
  return await setUserCurrency(c.req, c.get("user")!);
});
router.get(NETWORK_CONFIG.PERSONAL_INFO_PAGE.USER_CHANGE, async (c) => {
  return await updateUserInfo(c.req, c.get("user")!);
});
router.get(NETWORK_CONFIG.PERSONAL_INFO_PAGE.USER_EMAIL, async (c) => {
  return await updateUserEmail(c.req, c.get("user")!);
});
router.get(NETWORK_CONFIG.PERSONAL_INFO_PAGE.USER_CASHTAG, async (c) => {
  return await updateUserCashtag(c.req, c.get("user")!);
});
router.get(NETWORK_CONFIG.PERSONAL_INFO_PAGE.USER_PASSWORD, async (c) => {
  return await updateUserPassword(c.req, c.get("user")!);
});
router.get(NETWORK_CONFIG.PERSONAL_INFO_PAGE.USER_SUSPEND, async (c) => {
  return await suspendUser(c.req, c.get("user")!);
});
router.get(NETWORK_CONFIG.PERSONAL_INFO_PAGE.USER_CHECK, async (c) => {
  return await checkUser(c.req);
});
router.get(NETWORK_CONFIG.PERSONAL_INFO_PAGE.USER_EMAIL_VERIFY, async (c) => {
  return await verifyUserEmail(c.req, c.get("user")!);
});

export default router;

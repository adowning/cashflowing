import { User } from "better-auth/types";
import createRouter from "../rest/create-router";
import {
  createDeposit,
  getDepositHistory,
  getDepositMethods,
} from "../services/transactions/deposit";
import { NETWORK_CONFIG } from "@cashflow/types";

const router = createRouter();

router.post(NETWORK_CONFIG.DEPOSIT_PAGE.CONFIG, async (c) => {
  const user = c.get("user") as Partial<User>;
  return await getDepositMethods(c.req, user);
});

router.post(NETWORK_CONFIG.DEPOSIT_PAGE.HISTORY, async (c) => {
  console.log("history");
  const user = c.get("user") as User;
  return await getDepositHistory(c.req, user);
});

router.post(NETWORK_CONFIG.DEPOSIT_PAGE.SUBMIT, async (c) => {
  const user = c.get("user") as User;
  return await createDeposit(c.req, user);
});

export default router;

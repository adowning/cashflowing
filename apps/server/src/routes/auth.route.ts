import { NETWORK_CONFIG } from "@cashflow/types";
import createRouter from "../rest/create-router";
import { login, register, me, logout, google } from "../services/auth.service";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
// import { GetMe, LoginSchema, RegisterSchema } from './schema'
export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});
export const RegisterSchema = z.object({
  username: z.string(),
  password: z.string(),
});
// export const RegisterSchema = {}
const router = createRouter();
router.post(
  NETWORK_CONFIG.LOGIN.LOGIN,
  zValidator("json", LoginSchema),
  async (c) => {
    return await login(c.req);
  }
);
router.post(NETWORK_CONFIG.LOGIN.LOGOUT, async (c) => {
  return await logout(c.req);
});
router.post(
  NETWORK_CONFIG.LOGIN.REGISTER,
  zValidator("json", RegisterSchema),
  async (c) => {
    console.log("register");
    return await register(c.req);
  }
);
router.get(NETWORK_CONFIG.LOGIN.ME, async (c) => {
  console.log("asdf");
  return await me(c.req);
});
router.get(NETWORK_CONFIG.LOGIN.GOOGLE, async (c) => {
  return await google(c.req);
});

export default router;

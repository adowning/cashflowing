import type { OpenAPIHono } from "@hono/zod-openapi"; // If using OpenAPIHono for the main app
// import userRoutes from '../rest/routes/user.routes'; //

import { BASE_PATH } from "@cashflow/types";
import healthRoute from "./health.route";
import userRoute from "./user.route";
import depositRoute from "./deposit.route";
import currencyRoute from "./currency.route";
import vipRoute from "./vip.route";
import gameRoute from "./game.route";
import authRoute from "./auth.route";
import { Env } from "hono";
import createRouter from "../create-router";

export default [
  healthRoute,
  userRoute,
  depositRoute,
  currencyRoute,
  vipRoute,
  gameRoute,
  authRoute,
];

export function registerRoutes<TEnv extends Env = Env>(app: OpenAPIHono<TEnv>) {
  // return [app.route("/", healthRoute), app.route("/", userRoute)];
  console.log("registerRoutes");
  app.route(BASE_PATH, authRoute);
  app.route(BASE_PATH, userRoute);
  app.route(BASE_PATH, depositRoute);
  app.route(BASE_PATH, currencyRoute);
  app.route(BASE_PATH, vipRoute);
  app.route(BASE_PATH, gameRoute);
  app.route(BASE_PATH, healthRoute);
  return app;
}

// stand alone router type used for api client
export const router = registerRoutes(createRouter().basePath(BASE_PATH));
// eslint-disable-next-line ts/no-redeclare
export type router = typeof router;

export type AppType = typeof router;

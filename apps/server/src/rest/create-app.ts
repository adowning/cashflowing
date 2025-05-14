import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { Session } from "better-auth";
import type { AppApi } from "./types";
import notFound from "../middlewares/not-found";
import onError from "../middlewares/on-error";
import { BASE_PATH } from "./constans";
import createRouter from "./create-router";
import isAuthenticated from "../middlewares/is-authenticated";
import { Server } from "bun";
import { User } from "@cashflow/types";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui"; //
import { PrismaClient } from "@cashflow/db";
import { enhance } from "@cashflow/db/node_modules/@zenstackhq/runtime";
import { createHonoHandler } from "@zenstackhq/server/hono";
import { createServerClient } from "@supabase/ssr";
import { Context } from "hono";
import { registerRoutes } from "./routes";
import { me, login, register, logout, google } from "./services/auth.service";
import { auth } from "./auth";
const prisma = new PrismaClient();
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5a2ppeGZ1YXJncWtqa2d4c3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDczMDEyMjIsImV4cCI6MjAyMjg3NzIyMn0.t2ayCugyEAii4KHDG0rWRZcvQcILYtF_-UApm0XGlKg";

async function getCurrentUser(ctx: Context) {
  const cookies = ctx.req.header("cookie");
  console.log("cookies", cookies);
  if (!cookies)
    return new Response(JSON.stringify({ message: "Unauthorized" }));

  const supabase = createServerClient(
    "https://pykjixfuargqkjkgxsyc.supabase.co",
    supabaseAnonKey,
    {
      cookies: {
        async getAll() {
          return cookies.split(";").map((cookie) => {
            const [name, ...valueParts] = cookie.trim().split("=");
            return { name, value: valueParts.join("=") };
          });
        },
        setAll(cookiesToSet) {
          // try {
          //   cookiesToSet.forEach(({ name, value, options }) =>
          //     cookieStore.set(name, value, options)
          //   )
          // } catch {
          //   // The `setAll` method was called from a Server Component.
          //   // This can be ignored if you have middleware refreshing
          //   // user sessions.
          // }
        },
      },
    }
  );
  const { data: user } = await supabase.auth.getUser();
  return user.user as unknown as User;
  // const uid = user.user?.id;

  // TODO: if you need to access fields other than just "id" in access policies,
  // you can do a database query here to fetch the full user record
  // const contextUser = uid ? { id: uid } : undefined;
  // return enhance(prisma, { user: contextUser });
}
// eslint-disable-next-line node/no-process-env
const allowedOrigins = "['http://localhost:3000', 'https://cashflow.dev']"; // process.env.ALLOWED_ORIGINS || '*';

type HonoEnv = {
  Bindings: {
    serverInstance?: Server; // Make serverInstance known to Hono's Env
  };
  Variables: {
    user: Partial<User> | null;
    session: Session | null;
    serverInstance?: Server; // Make serverInstance known for c.set/c.get
  };
};
// c
export default function createApp() {
  const app = new OpenAPIHono<HonoEnv>(); // Use OpenAPIHono

  // const app = createRouter()
  app.use("*", serveStatic({ root: "./public" }));
  app
    .use("/*", cors())
    .use("*", logger())

    .use(async (c, next) => {
      if (c.req.method === "OPTIONS") {
        return c.text("ok", 200, {
          "Access-Control-Allow-Origin": allowedOrigins,
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "600",
          "Access-Control-Allow-Credentials": "true",
        });
      }
      // console.log("here2");
      console.log("here1");
      if (c.req.path.startsWith("/auth/session")) return await me(c.req);
      if (c.req.path.startsWith("/auth/login")) return await login(c.req);
      if (c.req.path.startsWith("/auth/register")) return await register(c.req);
      if (c.req.path.startsWith("/auth/logout")) return await logout(c.req);
      if (c.req.path.startsWith("/auth/google")) return await google(c.req);
      // if (c.req.path.startsWith("/api/user/deposithistory"))
      // return await getDepositHistory(c.req, c.get("user")!);
      if (c.req.path.startsWith(BASE_PATH)) {
        console.log("to api", c.req.path);
        return await next();
      }

      return serveStatic({ path: "./public" })(c, next);
    })
    .basePath(BASE_PATH);

  app
    // .use(
    //   "/*",
    //   createHonoHandler({
    //     getPrisma: async (ctx) => {
    //       return enhance(prisma, { user: await getCurrentUser(ctx) });
    //     },
    //   })
    // )
    .use(
      "*",
      logger(),

      async (c, next) => {
        // console.log("here");
        // console.log(c.req.path);
        const session = await auth.api.getSession({
          headers: c.req.raw.headers,
        });

        if (!session) {
          c.set("user", null);
          c.set("session", null);
          // console.log("no session");
          return next();
        }
        c.set("user", session.user as User);
        c.set("session", session.session);
        return next();
      }
    )
    .use(isAuthenticated)
    .notFound(notFound)
    .onError(onError) as OpenAPIHono;
  registerRoutes(app);
  return app;
}

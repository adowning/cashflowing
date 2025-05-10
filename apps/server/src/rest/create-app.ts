import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { Session } from "better-auth";
import type { AppApi } from "./types";
import notFound from "../middlewares/not-found";
import onError from "../middlewares/on-error";
import { auth } from "./auth";
import { BASE_PATH } from "./constans";
import createRouter from "./create-router";
import isAuthenticated from "../middlewares/is-authenticated";
import { Server } from "bun";
import { User } from "@cashflow/types";
import { login, register } from "../services/auth.service";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui"; //
import { registerRoutes } from "../routes";
import { PrismaClient } from "@cashflow/db";
import { enhance } from "@cashflow/db/node_modules/@zenstackhq/runtime";
import { createHonoHandler } from "@zenstackhq/server/hono";
import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { Context } from "hono";
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
const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS || "[]");

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
  app
    .use("*", serveStatic({ root: "./public" }))
    .use("*", logger())
    // .on(['POST', 'GET', 'OPTIONS'], '/auth/*', async (c, next) => {
    //   console.log('here2')
    //   console.log(c.req.path)
    //   // return auth.handler(c.req.raw)
    //   if (c.req.path.startsWith('/auth/login')) return await login(c.req)
    //   if (c.req.path.startsWith('/auth/register')) return await register(c.req)
    //   console.log('post get blah')
    //   return next()
    // })
    .use(async (c, next) => {
      console.log("here1");
      if (c.req.path.startsWith("/auth/login")) return await login(c.req);
      if (c.req.path.startsWith("/auth/register")) return await register(c.req);
      if (c.req.path.startsWith(BASE_PATH)) {
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
      cors({
        origin: allowedOrigins,
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["GET", "POST", "PUT", "DELETE"],
        maxAge: 600,
        credentials: true,
      }),
      async (c, next) => {
        console.log("here");
        const session = await auth.api.getSession({
          headers: c.req.raw.headers,
        });

        if (!session) {
          c.set("user", null);
          c.set("session", null);
          console.log("no session");
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

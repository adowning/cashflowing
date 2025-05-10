import { serveStatic } from 'hono/bun'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { Session } from 'better-auth'
import type { AppApi } from './types'
import notFound from '../middlewares/not-found'
import onError from '../middlewares/on-error'
import { auth } from './auth'
import { BASE_PATH } from './constans'
import createRouter from './create-router'
import isAuthenticated from '../middlewares/is-authenticated'
import { Server } from 'bun'
import { User } from '@cashflow/types'
import { login, register } from '../services/auth.service'
import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui' //
import { registerRoutes } from '../routes'
// eslint-disable-next-line node/no-process-env
const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS || '[]')

type HonoEnv = {
  Bindings: {
    serverInstance?: Server // Make serverInstance known to Hono's Env
  }
  Variables: {
    user: Partial<User> | null
    session: Session | null
    serverInstance?: Server // Make serverInstance known for c.set/c.get
  }
}
// c
export default function createApp() {
  const app = new OpenAPIHono<HonoEnv>() // Use OpenAPIHono

  // const app = createRouter()
  app
    .use('*', serveStatic({ root: './public' }))
    .use('*', logger())
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
      console.log('here1')
      if (c.req.path.startsWith('/auth/login')) return await login(c.req)
      if (c.req.path.startsWith('/auth/register')) return await register(c.req)
      if (c.req.path.startsWith(BASE_PATH)) {
        return await next()
      }

      return serveStatic({ path: './public' })(c, next)
    })

    .basePath(BASE_PATH)

    .use(
      '*',
      logger(),
      cors({
        origin: allowedOrigins,
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
        maxAge: 600,
        credentials: true,
      }),
      async (c, next) => {
        console.log('here')
        const session = await auth.api.getSession({
          headers: c.req.raw.headers,
        })

        if (!session) {
          c.set('user', null)
          c.set('session', null)
          console.log('no session')
          return next()
        }
        c.set('user', session.user)
        c.set('session', session.session)
        return next()
      },
    )

    .use(isAuthenticated)
    .notFound(notFound)

    .onError(onError) as OpenAPIHono
  registerRoutes(app)
  return app
}

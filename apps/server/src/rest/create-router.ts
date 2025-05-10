import { Hono } from 'hono'

import type { AppEnv } from './types'

// export default function createRouter() {
//   return new Hono<AppEnv>({
//     strict: true,
//   })
// }
import { OpenAPIHono } from '@hono/zod-openapi'

export default function createRouter(): OpenAPIHono<AppEnv> {
  const app = new OpenAPIHono<AppEnv>({
    strict: true,
  })
  return app
}

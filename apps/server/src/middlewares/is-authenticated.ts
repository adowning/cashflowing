import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

import type { AppEnv } from '../rest/types'

export default createMiddleware<AppEnv>(async (c, next) => {
  const user = c.get('user')
  console.log(user)
  if (!user) {
    throw new HTTPException(401, { message: 'Unauthorized' })
  }
  await next()
})

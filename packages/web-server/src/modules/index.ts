import Router from '@koa/router'
// import { registerDevRouter } from './dev'
import { API_PREFIX } from '@any-listen/common/constants'
import { registerIpcRouter } from './ipc'

const router = new Router<unknown, AnyListen.RequestContext>()

router.prefix(API_PREFIX)

// if (import.meta.env.DEV) registerDevRouter(router)

registerIpcRouter(router)

export default router

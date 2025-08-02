import type Koa from 'koa'
import type { LRUCache } from 'lru-cache'

declare global {
  namespace AnyListen {
    type RequestContext<ResponseBodyT = unknown> = Koa.ParameterizedContext<
      Koa.DefaultState,
      {
        userIp: string
        now: number
      },
      ResponseBodyT
    >
    type Next = Koa.Next
  }

  interface Anylisten {
    dataPath: string
    config: AnyListen.Config
    publicStaticPaths: LRUCache<string, string>
  }

  var anylisten: Anylisten
}

import { workers } from '@/worker'
import { proxyCallback } from '@/worker/utils'
import { generateId } from '@any-listen/common/utils'

const proxyCbs = new Map<string, () => void>()
export const runTimeout = (cb: () => void, d?: number) => {
  const id = generateId()
  const clear = () => {
    proxyCbs.delete(id)
    pcb.releaseProxy()
  }
  proxyCbs.set(id, clear)
  const pcb = proxyCallback(() => {
    if (!proxyCbs.has(id)) return
    clear()
    cb()
  })
  void workers.main.runTimeout(id, pcb, d)
  return id
}
export const stopTimeout = (id: string) => {
  const clear = proxyCbs.get(id)
  if (!clear) return
  clear()
  void workers.main.stopTimeout(id)
}

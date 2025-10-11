import { appEvent } from '@/app/app'
import { rendererIPC } from '@/app/renderer/winMain/rendererEvent'
import { getSockets, type ServerSocketWinMain } from '@/modules/ipc/websocket'

export const getConnectedClients = () => {
  return getSockets().filter((s) => s.isInited)
}

export const connectTools = {
  inited: false,
  promise: null as null | Promise<unknown>,
  promiseFn: [() => {}, () => {}] as [(result: unknown) => void, (error: Error) => void],
  callback: null as null | ((socket: ServerSocketWinMain) => Promise<unknown>),
  init() {
    if (this.inited) return
    this.inited = true
    appEvent.on('clientConnected', (socket) => {
      if (this.callback) {
        this.promise = this.promise ? Promise.any([this.promise, this.callback(socket)]) : this.callback(socket)
        void this.promise.then((result) => {
          this.promiseFn[0](result)
          this.callback = null
          this.promiseFn = [() => {}, () => {}]
        })
      }
    })
  },
  async run<T>(callback: (socket: ServerSocketWinMain) => Promise<T>): Promise<T> {
    this.init()
    this.callback = callback
    return new Promise<T>((resolve, reject) => {
      this.promiseFn = [resolve as () => void, reject]
      const connectSockets = getConnectedClients()
      if (connectSockets.length) {
        this.promise = Promise.any(
          Array.from(connectSockets).map(async (socket) => {
            return callback(socket)
          })
        )
        void this.promise.then((result) => {
          resolve(result as T)
          this.callback = null
          this.promiseFn = [() => {}, () => {}]
        })
      }
    }).finally(() => {
      this.promise = null
    })
  },
  stop(run: (socket: ServerSocketWinMain) => void, message?: string) {
    if (!this.callback) return
    this.callback = null
    this.promiseFn[1](new Error(message ?? 'canceled'))
    for (const socket of getConnectedClients()) {
      if (socket.isReady) run(socket)
    }
  },
}
export const boxTools = {
  datas: new Map<
    string,
    [(socket: ServerSocketWinMain) => Promise<unknown>, (result: unknown) => void, (error: Error) => void]
  >(),
  queue: [] as string[],
  promise: Promise.resolve(),
  currentKey: null as null | string,
  async showBox<T>(key: string, sync: boolean, run: (socket: ServerSocketWinMain) => Promise<T>): Promise<T> {
    // TODO async message box
    return new Promise<T>((resolve, reject) => {
      this.queue.push(key)
      this.datas.set(key, [run, resolve as (result: unknown) => void, reject])
      this.next()
    }).finally(() => {
      void rendererIPC.closeMessageBox(key)
    })
  },
  closeBox(key: string, message?: string) {
    if (!this.datas.has(key)) return
    const [, , reject] = this.datas.get(key)!
    if (this.currentKey == key) {
      connectTools.stop((socket) => {}, message)
      void rendererIPC.closeMessageBox(key)
      reject(new Error(message ?? 'canceled'))
      this.queue.splice(this.queue.indexOf(key), 1)
      this.datas.delete(key)
      this.currentKey = null
      this.next()
    } else {
      reject(new Error(message ?? 'canceled'))
      this.datas.delete(key)
      this.queue.splice(this.queue.indexOf(key), 1)
    }
  },
  next() {
    if (this.currentKey) return
    void this.promise.finally(() => {
      if (!this.queue.length) return
      const key = this.queue[0]
      this.currentKey = key
      const [run, resolve, reject] = this.datas.get(key)!
      void connectTools
        .run(run)
        .then(resolve)
        .catch(reject)
        .finally(() => {
          if (this.currentKey != key) return
          this.queue.splice(this.queue.indexOf(key), 1)
          this.datas.delete(key)
          this.currentKey = null
          this.next()
        })
    })
  },
}

// import { hostCallActions } from '@/host/hostActions'
import type { AbortSignal } from '@/event/AbortController'
import { hostContext } from '@/host/state'
import { generateId } from '@/utils'

// export const init = () => {
//   hostCallActions('init', '')
// }

// export const showUpdateAlert = () => {
//   hostCallActions('show_update_alert', '')
// }

// export const app: AnyListen_API.App = {
const keys = new Set<string>()
const buildKey = async <T>(run: (key: string) => Promise<T>, signal?: AbortSignal) => {
  const key = generateId()
  keys.add(key)
  if (signal) {
    signal.on('abort', () => {
      if (!keys.has(key)) return
      void hostContext.hostFuncs.closeMessageBox(key)
    })
  }
  return run(key).finally(() => {
    keys.delete(key)
  })
}
export const app: AnyListen_API.App = {
  async showMessage(message, { signal, ...options } = {}) {
    return buildKey(
      async (key) => {
        return hostContext.hostFuncs.showMessageBox(key, { ...options, title: message })
      },
      signal as AbortSignal | undefined
    )
  },
  // TODO
  async showFormDialog({ signal, ...options }: AnyListen_API.FormDialogOptions) {
    return buildKey(
      async (key) => {
        // return hostContext.hostFuncs.showInputBox(key, options)
      },
      signal as AbortSignal | undefined
    )
  },
  async showOpenDialog({ signal, ...options }) {
    return buildKey(
      async (key) => {
        return hostContext.hostFuncs.showOpenBox(key, options) as Promise<string | string[] | undefined>
      },
      signal as AbortSignal | undefined
    )
  },
  async showSaveDialog({ signal, ...options }) {
    return buildKey(
      async (key) => {
        return hostContext.hostFuncs.showSaveBox(key, options) as Promise<string | undefined>
      },
      signal as AbortSignal | undefined
    )
  },
  // async getConnectedClient() {
  //   return hostContext.hostFuncs.getConnectedClients()
  // },
}

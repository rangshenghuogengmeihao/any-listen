import { extensionState } from '../state'

export const createMusicUtils = (extension: AnyListen.Extension.Extension) => {
  return {
    async createProxyUrl(url: string, options: AnyListen.IPCExtension.RequestOptions) {
      return extensionState.remoteFuncs.createProxyUrl(url, options)
    },
    async writeProxyCache(url: string, data: Uint8Array) {
      return extensionState.remoteFuncs.writeProxyCache(url, data)
    },
  } as const
}

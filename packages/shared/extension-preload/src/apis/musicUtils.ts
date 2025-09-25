import { hostContext } from '@/host/state'

export const musicUtils: AnyListen_API.MusicUtils = {
  async createProxyUrl(url: string, options: AnyListen_API.RequestOptions) {
    return hostContext.hostFuncs.createProxyUrl(url, options)
  },
  async writeProxyCache(fileName: string, data: Uint8Array) {
    return hostContext.hostFuncs.writeProxyCache(fileName, data)
  },
}

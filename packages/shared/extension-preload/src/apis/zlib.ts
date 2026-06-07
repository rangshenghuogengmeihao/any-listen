import { hostContext } from '@/host/state'

export const zlib: AnyListen_API.Zlib = {
  async deflate(data, encoding, options) {
    return hostContext.hostFuncs.deflate(data, encoding, options)
  },
  async inflate(data, encoding, options) {
    return hostContext.hostFuncs.inflate(data, encoding, options)
  },
}

import { createCache } from '@any-listen/common/cache'
import { getMimeType } from '@any-listen/common/mime'
import { isLikelyGarbage } from '@any-listen/common/utils'
import { basename, extname } from '@any-listen/nodejs'
import { decodeString } from '@any-listen/nodejs/char'
import { parseBufferMetadata } from '@any-listen/nodejs/music'
import { WebDAVClient } from '@any-listen/nodejs/webdav-client'
import { hostContext, logcat } from './shared'

const cache = createCache({ max: 10, ttl: 60 * 1000 })

export interface WebDAVClientOptions {
  url: string
  username: string
  password?: string
  path: string
}

export type { WebDAVFileItem, WebDAVItem } from '@any-listen/nodejs/webdav-client'

export const createWebDAVClient = (options: WebDAVClientOptions) => {
  // const webDAVClient = new WebDAVClient({
  //   baseUrl: 'https://dav.jianguoyun.com/dav/',
  //   username: 'lyswhut@qq.com',
  //   password: 'ajiqvk2qcumvygzd',
  // })
  // void webDAVClient.getHead('/musics/test/1314公里 - 魏佳艺、R7[DJ].mp3').then((res) => {
  //   logcat.error('WebDAV root directory contents:', res)
  // })
  // void webDAVClient.ls('/musics/test/1314公里 - 魏佳艺、R7[DJ].lrc').then((res) => {
  //   logcat.error('WebDAV root directory contents:', res)
  // })
  // void webDAVClient.get('/musics/test/1314公里 - 魏佳艺、R7[DJ].lrc').then((res) => {
  //   logcat.error('WebDAV file contents:', res.toString())
  // })
  // void webDAVClient
  //   .put('/musics/test/彩云之南 - 徐千雅.mp3', 'E:\\桌面文件\\新建文件夹 (2)\\彩云之南 - 徐千雅.mp3')
  //   .then((res) => {
  //     logcat.error('WebDAV result contents:', res)
  //   })
  return new WebDAVClient({
    baseUrl: options.url,
    username: options.username,
    password: options.password,
  })
}

export const testDir = async (options: WebDAVClientOptions) => {
  const webDAVClient = createWebDAVClient(options)
  await webDAVClient.ls(options.path).catch((err: Error) => {
    const msg = err.message
    if (msg.startsWith('401')) {
      if (!options.password) {
        throw new Error(hostContext.i18n.t('exts.webdav.form.error.no_password'))
      } else {
        throw new Error(hostContext.i18n.t('exts.webdav.form.error.invalid_password'))
      }
    }
    throw err
  })
}

const nextLenMap = {
  0: 8 * 1024 - 1,
  [8 * 1024 - 1]: 16 * 1024 - 1,
  [16 * 1024 - 1]: 32 * 1024 - 1,
  [32 * 1024 - 1]: 64 * 1024 - 1,
  [64 * 1024 - 1]: 96 * 1024 - 1,
  [96 * 1024 - 1]: 128 * 1024 - 1,
  [128 * 1024 - 1]: 192 * 1024 - 1,
  [192 * 1024 - 1]: 256 * 1024 - 1,
}
const requestParseMetadata = async (
  webDAVClient: WebDAVClient,
  path: string,
  mimeType: string,
  needCache = false,
  data = Buffer.from([]),
  preLength = 0
) => {
  if (cache.has(path)) return cache.get<ReturnType<typeof parseBufferMetadata>>(path)!
  let nextLength = nextLenMap[preLength]
  if (!nextLength) return null
  data = Buffer.concat([data, await webDAVClient.getPartial(path, preLength, nextLength)]) // first 8k
  const metaHead = await parseBufferMetadata(data, mimeType).catch(() => {
    // logcat.error('parseBufferMetadata error', err)
    return null
  })
  if (!metaHead) return null
  if (metaHead.name || metaHead.singer || metaHead.albumName) {
    if (needCache) cache.set(path, metaHead)
    return metaHead
  }
  // logcat.info('try next length', nextLenMap[nextLength])
  return requestParseMetadata(webDAVClient, path, mimeType, needCache, data, nextLength)
}
let requestParseMetadataPromises = new Map<string, ReturnType<typeof requestParseMetadata>>()
const handleParseMetadata = async (webDAVClient: WebDAVClient, path: string, mimeType: string, needCache = false) => {
  if (cache.has(path)) return cache.get<ReturnType<typeof parseBufferMetadata>>(path)!
  if (requestParseMetadataPromises.has(path)) return requestParseMetadataPromises.get(path)!
  const promise = requestParseMetadata(webDAVClient, path, mimeType, needCache).finally(() => {
    requestParseMetadataPromises.delete(path)
  })
  requestParseMetadataPromises.set(path, promise)
  return promise
}

export const parseMusicMetadata = async (options: WebDAVClientOptions, path: string, fileSize?: number) => {
  const webDAVClient = createWebDAVClient(options)
  const mimeType = getMimeType(basename(path))
  const metaHead = await handleParseMetadata(webDAVClient, path, mimeType)
  // logcat.info('metaHead', metaHead)
  if (metaHead?.name || metaHead?.singer || metaHead?.albumName) return metaHead
  if (!fileSize) {
    const headers = await webDAVClient.getHead(path)
    fileSize = parseInt(headers['content-length'] || '0', 10)
    if (isNaN(fileSize) || !fileSize) {
      logcat.error('Get file size error', path, headers)
      return null
    }
  }
  const data = await webDAVClient.getPartial(path, fileSize - 32 * 1024, fileSize - 1) // last 32k
  const metaTail = await parseBufferMetadata(data, mimeType).catch(() => {
    // logcat.error('parseBufferMetadata error', err)
    return null
  })
  // logcat.info('metaTail', metaTail)
  if (metaTail?.name || metaTail?.singer || metaTail?.albumName) return metaTail
  return null
}

const checkFile = async (webDAVClient: WebDAVClient, path: string) => {
  return webDAVClient
    .getHead(path)
    .then(() => true)
    .catch(() => false)
}

export const getMusicUrl = async (options: WebDAVClientOptions, path: string) => {
  if (!path || typeof path !== 'string') throw new Error('invalid path')
  const webDAVClient = createWebDAVClient(options)
  if (!(await checkFile(webDAVClient, path))) throw new Error('file not exists')
  const [url, reqOpts] = webDAVClient.getRequestOptions(path)
  return hostContext.createProxyUrl(url, reqOpts)
}

const tryPicExt = ['.jpg', '.jpeg', '.png'] as const
const getDirCoverPic = async (webDAVClient: WebDAVClient, path: string) => {
  const filePath = new RegExp(`\\${extname(path)}$`)
  for await (const ext of tryPicExt) {
    const picPath = path.replace(filePath, ext)
    if (await checkFile(webDAVClient, picPath)) return picPath
  }
  return null
}
const getDirNamePic = async (webDAVClient: WebDAVClient, path: string) => {
  const filePath = new RegExp(`\\${extname(path)}$`)
  for await (const ext of tryPicExt) {
    const picPath = path.replace(filePath, ext)
    if (await checkFile(webDAVClient, picPath)) return picPath
  }
  return null
}
export const getMusicPic = async (options: WebDAVClientOptions, path: string) => {
  const webDAVClient = createWebDAVClient(options)
  let pic = await getDirNamePic(webDAVClient, path)
  if (pic) {
    const [url, reqOpts] = webDAVClient.getRequestOptions(pic)
    return hostContext.createProxyUrl(url, reqOpts)
  }
  const mimeType = getMimeType(basename(path))
  const metaHead = await handleParseMetadata(webDAVClient, path, mimeType, true)
  if (metaHead?.pic) {
    const filePath = new RegExp(`\\${extname(path)}$`)
    const [type, ext] = metaHead.pic.format.split('/')
    if (type == 'image') {
      const [url] = webDAVClient.getRequestOptions(path.replace(filePath, `.${ext}`))
      return hostContext.writeProxyCache(url, metaHead.pic.data)
    }
  }

  pic = await getDirCoverPic(webDAVClient, path)
  if (pic) {
    const [url, reqOpts] = webDAVClient.getRequestOptions(pic)
    return hostContext.createProxyUrl(url, reqOpts)
  }
  throw new Error('get pic failed')
}

export const getMusicLyric = async (options: WebDAVClientOptions, path: string) => {
  const webDAVClient = createWebDAVClient(options)
  const lrcPath = path.replace(new RegExp(`\\${extname(path)}$`), '.lrc')
  if (await checkFile(webDAVClient, lrcPath)) {
    const data = await webDAVClient.get(lrcPath).catch((err) => {
      logcat.error('get lrc file error', err)
      return null
    })
    if (data) {
      const lrc = await decodeString(data)
      if (lrc && !isLikelyGarbage(lrc)) return lrc
    }
  }

  const mimeType = getMimeType(basename(path))
  const metaHead = await handleParseMetadata(webDAVClient, path, mimeType, true)
  return metaHead?.lyric || null
}

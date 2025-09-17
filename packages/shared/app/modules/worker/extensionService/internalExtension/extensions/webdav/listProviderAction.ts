import { sizeFormate } from '@any-listen/common/utils'
import { logcat } from './shared'
import { getWebDAVOptionsByListInfo, getWebDAVOptionsByMusicInfo } from './utils'
import { createWebDAVClient, parseMusicMetadata, testDir, type WebDAVFileItem } from './webdav'

const listCache = new Map<string, Map<string, WebDAVFileItem>>()

const isMusicFile = (name: string) => {
  return /\.(mp3|flac|wav|m4a|aac|ogg)$/i.test(name)
}
export const listProviderActions: AnyListen.IPCExtension.ListProviderAction = {
  async createList(params) {
    logcat.info(`ListProviderAction createList`, params)
    await testDir(await getWebDAVOptionsByListInfo(params.data.meta))
  },
  async deleteList(params) {
    logcat.info(`ListProviderAction deleteList`, params)
  },
  async updateList(params) {
    logcat.info(`ListProviderAction updateList`, params)
    await testDir(await getWebDAVOptionsByListInfo(params.data.meta))
  },
  async getListMusicIds({ data }) {
    const options = await getWebDAVOptionsByListInfo(data.meta)
    const webDAVClient = createWebDAVClient(options)
    const list = await webDAVClient.ls(options.path).catch((err) => {
      logcat.error('WebDAV list error', err)
      throw err
    })
    const map = new Map<string, WebDAVFileItem>()
    listCache.set(data.id, map)
    const extId = data.meta.extensionId
    const source = data.meta.source
    return (list.filter((item) => !item.isDir && item.size > 0 && isMusicFile(item.name)) as WebDAVFileItem[]).map((item) => {
      const path = `${extId}_${source}_${options.url}/${item.path}`
      map.set(path, item)
      return path
    })
  },
  async getMusicInfoByIds({ data }) {
    let listMap = listCache.get(data.list.id)
    const options = await getWebDAVOptionsByListInfo(data.list.meta)
    if (!listMap) {
      const webDAVClient = createWebDAVClient(options)
      const list = await webDAVClient.ls(options.path)
      const extId = data.list.meta.extensionId
      const source = data.list.meta.source
      listCache.set(
        data.list.id,
        new Map(
          (list.filter((item) => !item.isDir && item.size > 0 && isMusicFile(item.name)) as WebDAVFileItem[]).map((item) => [
            `${extId}_${source}_${options.url}/${item.path}`,
            item,
          ])
        )
      )
    }
    return {
      musics: data.ids
        .map((id) => {
          const item = listMap!.get(id)
          if (!item) return null
          return {
            id,
            name: item.name,
            singer: '',
            isLocal: false,
            interval: null,
            meta: {
              createTime: 0,
              musicId: id,
              albumName: '',
              posTime: 0,
              source: 'webdav',
              size: item.size,
              sizeStr: sizeFormate(item.size),
              updateTime: 0,
              url: options.url,
              username: options.username,
              path: item.path,
            },
          } satisfies AnyListen.Music.MusicInfoOnline
        })
        .filter((m) => m != null),
      waitingParseMetadata: true,
    }
  },
  async parseMusicInfoMetadata({ data: musicInfo }) {
    const url = musicInfo.meta.url
    if (!url || typeof url !== 'string' || !musicInfo.meta.path || typeof musicInfo.meta.path !== 'string') return musicInfo
    const options = await getWebDAVOptionsByMusicInfo(musicInfo)
    const meta = await parseMusicMetadata(options, options.path, (musicInfo.meta.size as number) || 0)
    if (!meta) return musicInfo
    return {
      ...musicInfo,
      name: meta.name || musicInfo.name,
      singer: meta.singer || musicInfo.singer,
      interval: meta.interval || musicInfo.interval,
      meta: {
        ...musicInfo.meta,
        albumName: meta.albumName || musicInfo.meta.albumName || '',
        year: meta.year || musicInfo.meta.year || 0,
        bitrateLabel: meta.bitrateLabel || musicInfo.meta.bitrateLabel || '',
      },
    }
  },
}

import { services } from '../resources/shared'
import { findMusic } from './search/music/actions'
import { allowedUrl, buildExtSourceId, getExtSource } from './utils'

export const searchMusicPic = async ({
  extensionId,
  source,
  name,
  artist,
}: {
  extensionId: string
  source: string
  name: string
  artist?: string
}): Promise<string[]> => {
  return services.extensionSerive
    .resourceAction('musicPicSearch', {
      extensionId,
      source,
      name,
      artist,
    })
    .then((result) => {
      // console.log(result)
      return result
    })
}

export const getMusicPicByExtensionSource = async ({
  extensionId,
  source,
  musicInfo,
}: {
  extensionId: string
  source: string
  musicInfo: AnyListen.Music.MusicInfo
}): Promise<string> => {
  return services.extensionSerive
    .resourceAction('musicPic', {
      extensionId,
      source,
      musicInfo,
    })
    .then((result) => {
      // console.log(result)
      if (!result) throw new Error('Get music pic failed')
      if (!allowedUrl(result)) throw new Error('Get music pic failed, url not allowed')
      return result
    })
}

const handleGetMusicPic = async (
  {
    musicInfo,
  }: {
    musicInfo: AnyListen.Music.MusicInfoOnline
  },
  excludeList: string[] = []
): Promise<string> => {
  const source = getExtSource('musicPic', excludeList, musicInfo.meta.source)
  if (!source) throw new Error('Get url failed, no source')
  return getMusicPicByExtensionSource({
    extensionId: source.extensionId,
    source: source.id,
    musicInfo,
  }).catch(async (e) => {
    console.error(e)
    excludeList.push(buildExtSourceId(source.extensionId, source.id))
    return handleGetMusicPic({ musicInfo }, excludeList)
  })
}

const handleFindMusicPic = async (
  info: {
    name: string
    singer: string
    albumName: string
    interval: string | null
  },
  excludeList: string[] = []
): Promise<string> => {
  const source = getExtSource('musicSearch', excludeList)
  if (!source) throw new Error('Get url failed, no source')
  const music = await findMusic({ extensionId: source.extensionId, source: source.id, ...info })
  if (music) {
    try {
      return await handleGetMusicPic({ musicInfo: music })
    } catch (e) {
      console.error(e)
    }
  }
  excludeList.push(buildExtSourceId(source.extensionId, source.id))
  return handleFindMusicPic(info, excludeList)
}

export const getMusicPic = async (data: { musicInfo: AnyListen.Music.MusicInfo }): Promise<string> => {
  if (!data.musicInfo.isLocal) {
    try {
      return await handleGetMusicPic({ musicInfo: data.musicInfo })
    } catch {}
  }
  return handleFindMusicPic({
    name: data.musicInfo.name,
    singer: data.musicInfo.singer,
    albumName: data.musicInfo.meta.albumName,
    interval: data.musicInfo.interval,
  })
}

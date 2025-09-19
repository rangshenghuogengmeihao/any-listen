import { findMusic as findMusicByExt } from './search/music/actions'
import { buildExtSourceId, getExtSource } from './utils'

const handleFindMusic = async <T>(
  info: {
    name: string
    singer: string
    albumName: string
    interval: string | null
  },
  handler: (info: AnyListen.Music.MusicInfoOnline) => Promise<T>,
  excludeList: string[] = []
): Promise<T> => {
  const source = getExtSource('musicSearch', excludeList)
  if (!source) throw new Error('Get url failed, no source')
  const music = await findMusicByExt({ extensionId: source.extensionId, source: source.id, ...info })
  if (music) {
    try {
      return await handler(music)
    } catch (e) {
      console.error(e)
    }
  }
  excludeList.push(buildExtSourceId(source.extensionId, source.id))
  return handleFindMusic(info, handler, excludeList)
}

export const findMusic = async <T>(
  musicInfo: {
    name: string
    singer: string
    albumName: string
    interval: string | null
    rawName?: string
    source?: string
  },
  handler: (info: AnyListen.Music.MusicInfoOnline) => Promise<T>
) => {
  const excludeList: string[] = musicInfo.source ? [musicInfo.source] : []
  try {
    return await handleFindMusic<T>(
      {
        name: musicInfo.name,
        singer: musicInfo.singer,
        albumName: musicInfo.albumName,
        interval: musicInfo.interval,
      },
      handler,
      [...excludeList]
    )
  } catch {}
  if (musicInfo.name.includes('-')) {
    const [name, singer] = musicInfo.name.split('-').map((val) => val.trim())
    try {
      return await handleFindMusic<T>(
        {
          name,
          singer,
          albumName: musicInfo.albumName,
          interval: musicInfo.interval,
        },
        handler,
        [...excludeList]
      )
    } catch {}
    try {
      return await handleFindMusic<T>(
        {
          name: singer,
          singer: name,
          albumName: musicInfo.albumName,
          interval: musicInfo.interval,
        },
        handler,
        [...excludeList]
      )
    } catch {}
  }
  let fileName = musicInfo.rawName
  if (fileName) {
    fileName = fileName.substring(0, fileName.lastIndexOf('.'))
    if (fileName != musicInfo.name) {
      if (fileName.includes('-')) {
        const [name, singer] = fileName.split('-').map((val) => val.trim())
        try {
          return await handleFindMusic<T>(
            {
              name,
              singer,
              albumName: musicInfo.albumName,
              interval: musicInfo.interval,
            },
            handler,
            [...excludeList]
          )
        } catch {}
        try {
          return await handleFindMusic<T>(
            {
              name: singer,
              singer: name,
              albumName: musicInfo.albumName,
              interval: musicInfo.interval,
            },
            handler,
            [...excludeList]
          )
        } catch {}
      } else {
        try {
          return await handleFindMusic<T>(
            {
              name: fileName,
              singer: '',
              albumName: musicInfo.albumName,
              interval: musicInfo.interval,
            },
            handler,
            [...excludeList]
          )
        } catch {}
      }
    }
  }

  throw new Error('source not found')
}

export const findMusicByLocal = async <T>(
  musicInfo: AnyListen.Music.MusicInfoLocal,
  handler: (info: AnyListen.Music.MusicInfoOnline) => Promise<T>
) => {
  return findMusic(
    {
      name: musicInfo.name,
      singer: musicInfo.singer,
      albumName: musicInfo.meta.albumName,
      interval: musicInfo.interval,
      rawName: musicInfo.meta.filePath.split(/\/|\\/).at(-1),
    },
    handler
  )
}

export const findMusicByOnline = async <T>(
  musicInfo: AnyListen.Music.MusicInfoOnline,
  handler: (info: AnyListen.Music.MusicInfoOnline) => Promise<T>
) => {
  return findMusic(
    {
      name: musicInfo.name,
      singer: musicInfo.singer,
      albumName: musicInfo.meta.albumName,
      interval: musicInfo.interval,
      rawName: musicInfo.meta.fileName,
      source: musicInfo.meta.source,
    },
    handler
  )
}

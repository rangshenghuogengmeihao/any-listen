import { dateFormat, generateIdByPerf } from './utils'

export const getMusicInfo = (musicInfo: AnyListen.Download.ListItem | AnyListen.Music.MusicInfo) => {
  return 'progress' in musicInfo ? musicInfo.metadata.musicInfo : musicInfo
}

export const createPlayMusicInfo = (
  musicInfo: AnyListen.Music.MusicInfo,
  listId: string,
  isOnline: boolean,
  playLater: boolean,
  played = false
): AnyListen.Player.PlayMusicInfo => ({
  itemId: `${generateIdByPerf()}_${musicInfo.id}`,
  listId,
  isOnline,
  musicInfo,
  played,
  playLater,
})

export const createPlayMusicInfoList = (
  musicInfos: AnyListen.Music.MusicInfo[],
  listId: string,
  isOnline: boolean,
  playLater: boolean
) => musicInfos.map((m) => createPlayMusicInfo(m, listId, isOnline, playLater, false))

export const buildMusicName = (setting: AnyListen.AppSetting['download.fileName'], name: string, singer: string) =>
  singer ? setting.replace('%name%', name).replace('%singer%', singer) : name
export const buildSourceLabel = (musicinfo: AnyListen.Music.MusicInfo) => {
  if (musicinfo.isLocal) {
    switch (musicinfo.meta.ext) {
      case 'flac':
      case 'wav':
        return musicinfo.meta.bitrateLabel == '16bit'
          ? musicinfo.meta.ext.toUpperCase()
          : `${musicinfo.meta.ext.toUpperCase()} ${musicinfo.meta.bitrateLabel}`
      default:
        return musicinfo.meta.bitrateLabel?.toUpperCase() ?? ''
    }
  }
  return musicinfo.meta.source
}

export const logFormat = (log: AnyListen.LogInfo) => {
  return `${dateFormat(log.timestamp)} [${log.type}] ${log.message}`
}

import { workers } from '@/worker'
import { throttle } from '@any-listen/common/utils'
import { getPlayTime, savePlayTime } from './playTimeStore'

let playInfo: AnyListen.Player.SavedPlayInfo

const initPlayInfo = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (playInfo !== undefined) return
  const [info, time] = await Promise.all([workers.dbService.queryMetadataPlayInfo(), getPlayTime()])
  // eslint-disable-next-line require-atomic-updates
  playInfo = info
  if (playInfo.index > -1) playInfo.time = time
}

const savePlayInfoThrottle = throttle(() => {
  void workers.dbService.saveMetadataPlayInfo(playInfo)
}, 500)

const savePlayTimeThrottle = throttle(() => {
  void savePlayTime(playInfo.time)
}, 500)

export const setPlayTime = async (time: number) => {
  await initPlayInfo()
  playInfo.time = time
  savePlayTimeThrottle()
}

export const setPlayMusic = async (index: number, historyIndex: number) => {
  await initPlayInfo()
  playInfo = {
    index,
    time: 0,
    maxTime: 0,
    historyIndex,
  }
  savePlayInfoThrottle()
  savePlayTimeThrottle()
}

export const setPlayInfo = async (duration: number, index: number) => {
  await initPlayInfo()
  playInfo.maxTime = duration
  playInfo.index = index
  savePlayInfoThrottle()
}

export const getPlayInfo = async () => {
  await initPlayInfo()
  return playInfo
}

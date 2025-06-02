import Lyric from '@any-listen/web/lyric-font-player'
import { setLines, setTempOffset, setText } from './store/action'
// import { setStatusText } from '@/modules/player/store/actions'
import { settingState } from '../setting/store/state'
import type { Line } from './store/state'

let lrc: Lyric | null

export const setOffset = (offset: number) => {
  lrc?.setOffset(offset)
  setTempOffset(offset)
}

export const setPlaybackRate = (rate: number) => {
  lrc?.setPlaybackRate(rate)
}

export const setLyric = (lrcStr: string, extLrc: string[]) => {
  lrc?.setLyric(lrcStr, extLrc)
}
export const play = (currentTime: number) => {
  lrc?.play(currentTime)
}
export const pause = () => {
  lrc?.pause()
}

export const stop = () => {
  lrc?.setLyric('')
  setText('', -1)
}

export const initLyric = () => {
  lrc = new Lyric({
    shadowContent: false,
    onPlay(line: number, text: string) {
      setText(text, line)
      // setStatusText(text)
      // console.log('onPlay', line, text)
    },
    onSetLyric(lines: Line[], offset: number) {
      // listening lyrics seting event
      // console.log(lines) // lines is array of all lyric text
      setLines([...lines])
      setText('', -1)
      setOffset(offset) // 歌词延迟
      setTempOffset(0) // 重置临时延迟
    },
    onUpdateLyric(lines: Line[]) {
      setLines([...lines])
      setText('', -1)
    },
    rate: settingState.setting['player.playbackRate'],
    // offset: 80,
  })
  return () => {
    lrc?.pause()
    lrc = null
  }
}

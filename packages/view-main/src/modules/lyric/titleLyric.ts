import { setTitle } from '@/shared'
import { playerEvent } from '../player/store/event'
import { playerState } from '../player/store/state'
import { settingEvent } from '../setting/store/event'
import { settingState } from '../setting/store/state'
import { setDisabledAutoPause } from './lyric'
import { lyricEvent } from './store/event'

export const initTitleLyric = () => {
  let lrc = ''
  let playerTitle = ''
  let preText = ''
  const resetLyric = () => {
    preText = ''
    setTitle('')
  }
  const setLyric = (lyric = lrc) => {
    if (lrc != lyric) lrc = lyric
    if (!settingState.setting['player.isShowTitleLyric']) return
    const text = playerState.playing ? lrc || ' ' : playerTitle
    if (preText === text) return
    preText = text
    setTitle(text)
  }

  const handleEnable = (enable: boolean) => {
    setDisabledAutoPause(enable, 'titleLyric')
  }
  if (settingState.setting['player.isShowTitleLyric']) {
    handleEnable(true)
  }

  const unsub = settingEvent.on('updated', (keys, settings) => {
    if (keys.includes('player.isShowTitleLyric')) {
      handleEnable(settings['player.isShowTitleLyric']!)
      if (settings['player.isShowTitleLyric']!) {
        setLyric()
      } else {
        resetLyric()
        setTitle(playerTitle)
      }
    }
  })
  const unsub2 = lyricEvent.on('lineChanged', (text, line) => {
    setLyric(text)
  })
  const unsub3 = playerEvent.on('playStatusChanged', () => {
    setLyric()
  })
  const unsub4 = playerEvent.on('titleChanged', (title) => {
    playerTitle = title || ''
    if (settingState.setting['player.isShowTitleLyric']) {
      setLyric()
    } else {
      setTitle(title)
    }
  })

  return () => {
    unsub()
    unsub2()
    unsub3()
    unsub4()
  }
}

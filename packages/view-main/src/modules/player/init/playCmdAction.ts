import { onRelease } from '@/modules/app/shared'
import { appEvent } from '@/modules/app/store/event'
import { createUnsubscriptionSet } from '@/shared'

import { onPlayerCreated } from '../shared'
import { collectMusic, dislikeMusic, pause, play, skipNext, skipPrev, togglePlay, uncollectMusic } from '../store/actions'

let unregistered = createUnsubscriptionSet()
export const initPlayCmdAction = () => {
  onRelease(unregistered.clear.bind(unregistered))
  onPlayerCreated(() => {
    unregistered.register((unregistered) => {
      unregistered.add(
        appEvent.on('executeCommand', (cmd, ...args) => {
          switch (cmd) {
            case 'play':
              play()
              break
            case 'pause':
              pause()
              break
            case 'playToggle':
              togglePlay()
              break
            case 'next':
              void skipNext()
              break
            case 'previous':
              void skipPrev()
              break
            case 'favorite':
              void collectMusic()
              break
            case 'unfavorite':
              uncollectMusic()
              break
            case 'dislike':
              void dislikeMusic()
              break
            default:
              break
          }
        })
      )
    })
  })
}

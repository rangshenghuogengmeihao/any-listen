import { showMessageBox } from '@/components/apis/dialog/messageBox'
import { showNotifyBox } from '@/components/apis/notify'
import { createUnsubscriptionSet } from '@/shared'
import {
  messageBoxConfirm,
  onShowInputBox,
  onShowMessageBox,
  onShowOpenBox,
  onShowSaveBox,
  sendInitedEvent,
} from '@/shared/ipc/app'
import { keyboardEvent } from '../hotkey/keyboard'
import { settingEvent } from '../setting/store/event'
import { onRelease } from './shared'
import { setWorkerInitPromise } from './store/action'
import { appEvent } from './store/event'

let unregistereds = createUnsubscriptionSet()
export const initApp = () => {
  onRelease(unregistereds.clear.bind(unregistereds))
  settingEvent.on('inited', () => {
    unregistereds.register((subscriptions) => {
      subscriptions.add(
        onShowMessageBox((extId, key, options) => {
          if (options.modal) {
            void showMessageBox(extId, key, options)
              .then((result) => {
                void messageBoxConfirm(key, result)
              })
              .catch((error: Error) => {
                console.log(error)
                void messageBoxConfirm(key, undefined)
              })
          } else {
            void showNotifyBox(extId, key, options).finally(() => {
              void messageBoxConfirm(key, 0)
            })
          }
        })
      )
      subscriptions.add(
        onShowInputBox((key, options) => {
          // TODO
          void messageBoxConfirm(key, undefined)
        })
      )
      if (import.meta.env.VITE_IS_WEB) {
        subscriptions.add(
          onShowOpenBox((key, options) => {
            // TODO
            void messageBoxConfirm(key, undefined)
          })
        )
        subscriptions.add(
          onShowSaveBox((key, options) => {
            // TODO
            void messageBoxConfirm(key, undefined)
          })
        )
      }
    })
    void sendInitedEvent()
  })
  let mainWorkerResolve: () => void
  setWorkerInitPromise(new Promise((resolve) => (mainWorkerResolve = resolve)))
  window.addEventListener('worker-initialized-main', mainWorkerResolve!)

  document.documentElement.addEventListener(
    'contextmenu',
    (event) => {
      event.preventDefault()
    },
    {
      capture: true,
    }
  )
  window.addEventListener('focus', () => {
    appEvent.focus()
  })
  window.addEventListener('blur', () => {
    appEvent.blur()
  })
  keyboardEvent.on('mod+a_down', (evt) => {
    if (evt.inputing) return
    evt.event?.preventDefault()
  })
  if (import.meta.env.VITE_IS_WEB) {
    onRelease(() => {
      document.body.style.removeProperty('position')
      document.body.style.removeProperty('width')
      document.body.style.removeProperty('height')
      document.body.style.removeProperty('left')
      document.body.style.removeProperty('top')
      document.documentElement.style.fontSize = '16px'
      document.body.classList.remove('no-animation')
    })
  }
}

import { showMessageBox } from '@/components/apis/dialog/messageBox'
import { showNotifyBox } from '@/components/apis/notify'
import { closeMessageBoxEvent, deeplinkEvent, settingChangedEvent, updateInfoEvent } from './event'

export default {
  async settingChanged(keys, setting) {
    settingChangedEvent.emit(keys, setting)
  },
  async deeplink(deeplink) {
    deeplinkEvent.emit(deeplink)
  },
  async createDesktopLyricProcess() {
    // TODO
  },
  async showMessageBox(key, extId, options) {
    if (options.modal) {
      return showMessageBox(key, extId, options)
    }
    return showNotifyBox(key, extId, options)
  },
  async showInputBox(key, extId, options) {
    // TODO
    // return client.showInputBox(key, extId, options)
    return ''
  },
  async showOpenBox(key, extId, options) {
    // TODO import.meta.env.VITE_IS_WEB
  },
  async showSaveBox(key, extId, options) {
    // TODO import.meta.env.VITE_IS_WEB
  },
  async closeMessageBox(key) {
    closeMessageBoxEvent.emit(key)
  },
  async updateInfo(info) {
    updateInfoEvent.emit(info)
  },
} satisfies Partial<AnyListen.IPC.ClientIPC>

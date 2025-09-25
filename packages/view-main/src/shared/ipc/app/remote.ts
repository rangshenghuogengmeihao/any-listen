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
  async showMessageBox(extId, key, options) {
    if (options.modal) {
      return showMessageBox(extId, key, options)
    }
    return showNotifyBox(extId, key, options)
  },
  async showInputBox(extId, key, options) {
    // TODO
    // return client.showInputBox(extId, key, options)
    return ''
  },
  async showOpenBox(extId, key, options) {
    // TODO import.meta.env.VITE_IS_WEB
  },
  async showSaveBox(extId, key, options) {
    // TODO import.meta.env.VITE_IS_WEB
  },
  async closeMessageBox(key) {
    closeMessageBoxEvent.emit(key)
  },
  async updateInfo(info) {
    updateInfoEvent.emit(info)
  },
} satisfies Partial<AnyListen.IPC.ClientIPC>

import type { IPCSocket } from '@/preload/ws'
import type { ClientCall, ExposeFunctions } from '.'

// 暴露给后端的方法
export const createExposeApp = (client: ClientCall) => {
  return {
    async settingChanged(socket, keys, setting) {
      return client.settingChanged(keys, setting)
    },
    async deeplink(event, deeplink) {
      return client.deeplink(deeplink)
    },
    async createDesktopLyricProcess(event) {
      // TODO
      // return client.createDesktopLyricProcess(event.ports)
    },
    async showMessageBox(event, extId, key, options) {
      return client.showMessageBox(extId, key, options)
    },
    async showInputBox(event, extId, key, options) {
      return client.showInputBox(extId, key, options)
    },
    async showOpenBox(event, extId, key, options) {
      return client.showOpenBox(extId, key, options)
    },
    async showSaveBox(event, extId, key, options) {
      return client.showSaveBox(extId, key, options)
    },
    async closeMessageBox(event, key) {
      return client.closeMessageBox(key)
    },
    async updateInfo(event, info) {
      return client.updateInfo(info)
    },
  } satisfies Partial<ExposeFunctions>
}

// 暴露给前端的方法
export const createClientApp = (ipcSocket: IPCSocket) => {
  return {
    async getSetting() {
      return ipcSocket.remote.getSetting()
    },
    async setSetting(setting) {
      return ipcSocket.remote.setSetting(setting)
    },
    async inited() {
      return ipcSocket.remote.inited()
    },
    async minWindow() {
      // return ipcSocket.remote.minWindow()
    },
    async closeWindow(isForce) {
      await ipcSocket.logout()
      if (isForce) window.close()
      // return ipcSocket.remote.closeWindow(isForce)
    },
    // async showOpenDialog(opts) {
    //   // return main.showOpenDialog(opts)
    // },
    // async showSaveDialog(opts) {
    //   // return main.showSaveDialog(opts)
    // },
    async openDirInExplorer(path) {
      // return main.openDirInExplorer(path)
    },

    async clipboardReadText() {
      return navigator.clipboard.readText()
    },
    async clipboardWriteText(text) {
      await navigator.clipboard.writeText(text)
    },

    async fileSystemAction(action) {
      return ipcSocket.remote.fileSystemAction(action)
    },

    async getLoginDevices() {
      return ipcSocket.remote.getLoginDevices()
    },
    async removeLoginDevice(id) {
      return ipcSocket.remote.removeLoginDevice(id)
    },
    async openUrl(url) {
      window.open(url)
    },
    async getCurrentVersionInfo() {
      return ipcSocket.remote.getCurrentVersionInfo()
    },
    async checkUpdate() {
      return ipcSocket.remote.checkUpdate()
    },
    async downloadUpdate() {
      return ipcSocket.remote.downloadUpdate()
    },
    async restartUpdate() {
      return ipcSocket.remote.restartUpdate()
    },
  } satisfies Partial<AnyListen.IPC.ServerIPC>
}

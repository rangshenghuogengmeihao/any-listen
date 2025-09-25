import type { ClientCall, ExposeFunctions, MainCall } from '.'

// 暴露给后端的方法
export const createExposeApp = (client: ClientCall) => {
  return {
    async settingChanged(event, keys, setting) {
      return client.settingChanged(keys, setting)
    },
    async deeplink(event, deeplink) {
      return client.deeplink(deeplink)
    },
    async createDesktopLyricProcess(event) {
      return client.createDesktopLyricProcess(event.ports)
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
export const createClientApp = (main: MainCall) => {
  return {
    async getSetting() {
      return main.getSetting()
    },
    async setSetting(setting) {
      return main.setSetting(setting)
    },
    async inited() {
      return main.inited()
    },
    async minWindow() {
      return main.minWindow()
    },
    async closeWindow(isForce) {
      return main.closeWindow(isForce)
    },
    async showOpenDialog(opts) {
      return main.showOpenDialog(opts)
    },
    async showSaveDialog(opts) {
      return main.showSaveDialog(opts)
    },
    async openDirInExplorer(path) {
      return main.openDirInExplorer(path)
    },
    async clipboardReadText() {
      return main.clipboardReadText()
    },
    async clipboardWriteText(text) {
      return main.clipboardWriteText(text)
    },
    async openDevTools() {
      return main.openDevTools()
    },
    async openUrl(url) {
      return main.openUrl(url)
    },
    async getCurrentVersionInfo() {
      return main.getCurrentVersionInfo()
    },
    async checkUpdate() {
      return main.checkUpdate()
    },
    async downloadUpdate() {
      return main.downloadUpdate()
    },
    async restartUpdate() {
      return main.restartUpdate()
    },
  } satisfies Partial<AnyListen.IPC.ServerIPC>
}

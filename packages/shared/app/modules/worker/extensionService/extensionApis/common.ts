import { extensionState } from '../state'
import { cloneData } from './shared'

export const createCommon = (extension: AnyListen.Extension.Extension) => {
  return {
    async showMessageBox(key: string, options: AnyListen.IPCCommon.MessageDialogOptions) {
      const data = await extensionState.remoteFuncs.showMessageBox(extension.id, key, cloneData(options))
      return cloneData(data)
    },
    async showInputBox(key: string, options: AnyListen.IPCCommon.InputDialogOptions) {
      const data = await extensionState.remoteFuncs.showInputBox(extension.id, key, cloneData(options))
      return cloneData(data)
    },
    async showOpenBox(key: string, options: AnyListen.IPCCommon.OpenDialogOptions) {
      const data = await extensionState.remoteFuncs.showOpenBox(extension.id, key, cloneData(options))
      return cloneData(data)
    },
    async showSaveBox(key: string, options: AnyListen.IPCCommon.SaveDialogOptions) {
      const data = await extensionState.remoteFuncs.showSaveBox(extension.id, key, cloneData(options))
      return cloneData(data)
    },
    async closeMessageBox(key: string) {
      return extensionState.remoteFuncs.closeMessageBox(key)
    },
  } as const
}

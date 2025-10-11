import { generateId } from '@any-listen/common/utils'
import type { Message, TranslateValues } from '@any-listen/i18n'

let commonOptions: {
  getSettings: () => AnyListen.AppSetting
  showMessageBox: (key: string, options: AnyListen.IPCCommon.MessageDialogOptions) => Promise<number>
  translate: (key: keyof Message, val?: TranslateValues) => string
}

export const initCommon = (options: typeof commonOptions) => {
  commonOptions = options
}

export const getSettings = (): AnyListen.AppSetting => {
  return commonOptions.getSettings()
}

export const showMessageBox = async (options: AnyListen.IPCCommon.MessageDialogOptions) => {
  return commonOptions.showMessageBox(generateId(), options)
}

export const t = (key: keyof Message, val?: TranslateValues) => {
  return commonOptions.translate(key, val)
}

let commonOptions: {
  getSettings: () => AnyListen.AppSetting
}

export const initCommon = (options: typeof commonOptions) => {
  commonOptions = options
}

export const getSettings = (): AnyListen.AppSetting => {
  return commonOptions.getSettings()
}

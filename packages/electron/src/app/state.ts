import defaultSetting from '@/shared/defaultSetting'

export const appState: {
  envParams: AnyListen.EnvParams
  staticPath: string
  dataPath: string
  appSetting: AnyListen.AppSetting
  isSkipTrayQuit: boolean
  shouldUseDarkColors: boolean
  proxy: {
    host: string
    port: string
  }
} = {
  envParams: {
    cmdParams: {},
    workAreaSize: {
      height: 0,
      width: 0,
    },
  },
  proxy: {
    host: '',
    port: '',
  },
  staticPath: '',
  dataPath: '',
  appSetting: defaultSetting,
  isSkipTrayQuit: false,
  shouldUseDarkColors: false,
}

// import { compareVer } from './index'

export default (setting: Record<string, unknown>): Partial<AnyListen.AppSetting> => {
  setting = { ...setting }

  setting['extension.ghMirrorHosts'] = global.anylisten.config['extension.ghMirrorHosts']

  return setting
}

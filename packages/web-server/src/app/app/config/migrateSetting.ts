import { compareVersions } from '@any-listen/common/utils'

export const migrateSetting = (setting: Record<string, unknown>): Partial<AnyListen.AppSetting> => {
  setting = { ...setting }

  setting['extension.ghMirrorHosts'] = global.anylisten.config['extension.ghMirrorHosts']

  if (compareVersions(setting.version as string, '1.0.1') < 0) {
    setting.version = '1.0.1'

    if (setting['common.playBarProgressStyle'] == 'mini') setting['common.playBarProgressStyle'] = 'centerControl'
    if (setting['playDetail.style.fontSize'] == 120) setting['playDetail.style.fontSize'] = 100
    if (setting['playDetail.style.align'] == 'center') setting['playDetail.style.align'] = 'left'
    setting['playDetail.isDynamicBackground'] ||= true
  }

  return setting
}

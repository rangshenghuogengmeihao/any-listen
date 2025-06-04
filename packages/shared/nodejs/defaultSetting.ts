import commonDefaultSetting from '@any-listen/common/defaultSetting'
import os from 'node:os'
import path from 'node:path'
import { isMac, isWin } from './index'

const defaultSetting: AnyListen.AppSetting = {
  ...commonDefaultSetting,
  'common.controlBtnPosition': isMac ? 'left' : 'right',

  'player.isPlayAwlrc': isWin,

  'desktopLyric.isLockScreen': isWin,

  'download.savePath': path.join(os.homedir(), 'Desktop'),
}

export default defaultSetting

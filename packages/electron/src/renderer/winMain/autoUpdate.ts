import { appActions, appState } from '@/app'
import { log } from '@/shared/log'
import { isWin } from '@any-listen/nodejs/index'
import { autoUpdater } from 'electron-updater'
import { rendererIPC } from './rendererEvent'

autoUpdater.logger = log
autoUpdater.autoDownload = false
// autoUpdater.forceDevUpdateConfig = true

log.info('App starting...')

// TODO
function sendStatusToWindow(text: string) {
  log.info(text)
  // ipcMain.send('message', text)
}

export const initUpdate = () => {
  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...')
    void rendererIPC.updateInfo({
      type: 'checking',
    })
  })
  autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.')
    void rendererIPC.updateInfo({
      type: 'available',
      info: {
        version: info.version,
        isAutoUpdate: appState.appSetting['common.tryAutoUpdate'],
        // url: info.
        desc: info.releaseNotes as string,
        // isForce: boolean
      },
    })
  })
  autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.')
    // TODO
    void rendererIPC.updateInfo({
      type: 'not_available',
      info: {
        desc: '',
        version: '',
      },
    })
  })
  autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater.')
    void rendererIPC.updateInfo({
      type: 'error',
      message: err.message,
    })
  })
  autoUpdater.on('download-progress', (progressObj) => {
    let logMessage = `Download speed: ${progressObj.bytesPerSecond}`
    logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`
    logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`
    sendStatusToWindow(logMessage)
    void rendererIPC.updateInfo({
      type: 'download_progress',
      info: {
        bytesPerSecond: progressObj.bytesPerSecond,
        percent: progressObj.percent,
        total: progressObj.total,
        transferred: progressObj.transferred,
        delta: progressObj.delta,
      },
    })
  })
  autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded.')
    void rendererIPC.updateInfo({
      type: 'downloaded',
    })
  })
}

export const checkUpdate = () => {
  // 由于集合安装包中不包含win arm版，这将会导致arm版更新失败
  if (isWin && process.arch.includes('arm')) {
    void rendererIPC.updateInfo({
      type: 'error',
      message: 'The current platform does not support automatic updates',
    })
  } else {
    autoUpdater.autoDownload = appState.appSetting['common.tryAutoUpdate']
    void autoUpdater.checkForUpdates()
  }
}

export const downloadUpdate = async () => {
  if (!autoUpdater.isUpdaterActive()) return
  void autoUpdater.downloadUpdate()
}

export const restartUpdate = () => {
  appActions.setSkipTrayQuit(true)

  setTimeout(() => {
    autoUpdater.quitAndInstall(true, true)
  }, 1000)
}

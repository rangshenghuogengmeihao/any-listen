import { showSimpleModal } from '@/components/apis/dialog'
import { showNotify } from '@/components/apis/notify'
import { i18n } from '@/plugins/i18n'
import { versionEvent } from './event'
import { type State, versionState } from './state'

export const initCurrentVersionInfo = ({ ignoreVersion, progress, ...info }: AnyListen.CurrentVersionInfo) => {
  versionState.ignoreVersion = ignoreVersion
  versionState.progress = progress
  versionState.versionInfo = info
  versionEvent.ignore_version_updated(ignoreVersion)
  versionEvent.download_progress_updated(progress)
  versionEvent.updated(versionState.versionInfo)

  if (versionState.versionInfo.status != 'checking' && !versionState.versionInfo.isLatest) {
    versionEvent.new_version_available(versionState.versionInfo.newVersion, ignoreVersion)
  }
}

export const setIgnoreVersion = (version: State['ignoreVersion']) => {
  versionState.ignoreVersion = version
  versionEvent.ignore_version_updated(version)
}
export const setProgress = (info: State['progress']) => {
  versionState.progress = info
  versionEvent.download_progress_updated(versionState.progress)
}

export const setUpdateInfo = (info: AnyListen.IPCCommon.UpdateInfo) => {
  switch (info.type) {
    case 'checking':
      // versionState.versionInfo.isLatest = false
      versionState.versionInfo.status = 'checking'
      versionEvent.updated({ ...versionState.versionInfo })
      break
    case 'not_available':
      versionState.versionInfo.isLatest = true
      versionState.versionInfo.status = 'idle'
      versionState.versionInfo.newVersion = info.info
      versionEvent.updated({ ...versionState.versionInfo })
      break
    case 'available': {
      const { ignoreVersion, isAutoUpdate, ...newVersion } = info.info
      versionState.versionInfo.isLatest = false
      versionState.versionInfo.status = 'idle'
      versionState.versionInfo.newVersion = newVersion
      versionState.ignoreVersion = ignoreVersion
      versionEvent.ignore_version_updated(ignoreVersion)
      versionEvent.updated({ ...versionState.versionInfo })
      versionEvent.new_version_available(newVersion, ignoreVersion)
      break
    }
    case 'downloaded':
      versionState.versionInfo.status = 'downloaded'
      versionEvent.updated({ ...versionState.versionInfo })
      break
    case 'download_progress':
      if (versionState.versionInfo.status != 'downloading') {
        versionState.versionInfo.status = 'downloading'
        versionEvent.updated({ ...versionState.versionInfo })
      }
      versionState.progress = info.info
      versionEvent.download_progress_updated(info.info)
      break
    case 'error': {
      let preStatus = versionState.versionInfo.status
      versionState.versionInfo.status = 'error'
      versionEvent.updated({ ...versionState.versionInfo })
      if (preStatus == 'downloading') {
        const preTime = parseInt(localStorage.getItem('update__download_failed_tip') ?? '0')
        if (Date.now() - preTime < 7 * 86400_000) return
        void showSimpleModal(i18n.t('update_failed_tip')).finally(() => {
          localStorage.setItem('update__download_failed_tip', String(Date.now()))
        })
      } else if (preStatus == 'checking') {
        showNotify(i18n.t('update.checking_failed', { msg: info.message }))
      } else if (preStatus == 'idle') {
        showNotify(i18n.t('update.update_failed', { msg: info.message }))
      }
      break
    }
  }
}

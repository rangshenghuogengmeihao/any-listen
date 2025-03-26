import { versionEvent } from './event'
import { type State, versionState } from './state'

export const initCurrentVersionInfo = ({ ignoreVersion, progress, ...info }: AnyListen.CurrentVersionInfo) => {
  versionState.ignoreVersion = ignoreVersion
  versionState.progress = progress
  versionState.versionInfo = info
  versionEvent.updated(versionState.versionInfo)
  versionEvent.download_progress_updated(progress)
  versionEvent.ignore_version_updated(ignoreVersion)
}

export const setIgnoreVersion = (version: State['ignoreVersion']) => {
  versionState.ignoreVersion = version
  versionEvent.ignore_version_updated(version)
}
export const setProgress = (info: State['progress']) => {
  versionState.progress = info
  versionEvent.download_progress_updated(versionState.progress)
}
export const setVisibleModal = (visible: boolean) => {
  if (versionState.showModal == visible) return
  versionState.showModal = visible
  versionEvent.visible_modal(versionState.showModal)
}

export const setUpdateInfo = (info: AnyListen.IPCCommon.UpdateInfo) => {
  switch (info.type) {
    case 'checking':
      versionState.versionInfo.isLatest = false
      versionEvent.updated({ ...versionState.versionInfo })
      break
    case 'not_available':
      versionState.versionInfo.isLatest = true
      versionState.versionInfo.status = 'idle'
      versionState.versionInfo.newVersion = info.info
      versionEvent.updated({ ...versionState.versionInfo })
      break
    case 'available':
      versionState.versionInfo.isLatest = false
      versionState.versionInfo.status = 'idle'
      versionState.versionInfo.newVersion = info.info
      versionEvent.updated({ ...versionState.versionInfo })
      break
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
    case 'error':
      versionState.versionInfo.status = 'error'
      versionEvent.updated({ ...versionState.versionInfo })
      break
  }
}

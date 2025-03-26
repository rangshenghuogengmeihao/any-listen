export interface State {
  showModal: boolean
  versionInfo: {
    version: string
    commit: string
    commitDate: number
    newVersion: AnyListen.UpdateInfo | null
    showModal: boolean
    isUnknown: boolean
    isLatest: boolean
    reCheck: boolean
    status: AnyListen.UpdateStatus
  }
  ignoreVersion: string | null
  progress: AnyListen.DownloadProgressInfo | null
}

export const versionState: State = {
  showModal: false,
  versionInfo: {
    version: '0.0.0',
    commit: '',
    commitDate: 0,
    newVersion: null,
    showModal: false,
    reCheck: false,
    isUnknown: false,
    isLatest: false,
    status: 'idle',
  },
  ignoreVersion: null,
  progress: null,
}

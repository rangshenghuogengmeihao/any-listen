import { versionState } from './store/state'

import { readable } from 'svelte/store'
import { versionEvent } from './store/event'

export const showModal = readable(versionState.showModal, (set) => {
  const handleUpdate = () => {
    set(versionState.showModal)
  }
  handleUpdate()
  versionEvent.on('visible_modal', handleUpdate)

  return () => {
    versionEvent.off('visible_modal', handleUpdate)
  }
})

export const useVersionInfo = () => {
  let val = $state(versionState.versionInfo)

  $effect(() => {
    const unsub = versionEvent.on('updated', (info) => {
      val = info
    })
    return unsub
  })

  return {
    get val() {
      return val
    },
  }
}

export const useIgnoreVersion = () => {
  let val = $state(versionState.ignoreVersion)

  $effect(() => {
    const unsub = versionEvent.on('ignore_version_updated', (info) => {
      val = info
    })
    return unsub
  })

  return {
    get val() {
      return val
    },
  }
}

export const useDownloadProgress = () => {
  let val = $state(versionState.progress)

  $effect(() => {
    const unsub = versionEvent.on('download_progress_updated', (info) => {
      val = info
    })
    return unsub
  })

  return {
    get val() {
      return val
    },
  }
}

import { showUpdateModal } from '@/components/apis/updateModal'
import { onConnected, onRelease } from '@/modules/app/shared'
import { createUnsubscriptionSet } from '@/shared'
import { settingState } from '../setting/store/state'
import { getCurrentVersionInfo, initCurrentVersionInfo, registerRemoteActions } from './store/actions'
import { versionEvent } from './store/event'

const init = async () => {
  const info = await getCurrentVersionInfo()
  console.log(info)
  initCurrentVersionInfo(info)
}

const unregistered = createUnsubscriptionSet()
export const initVersion = () => {
  onRelease(unregistered.clear.bind(unregistered))
  onConnected(() => {
    unregistered.register((subscriptions) => {
      subscriptions.add(registerRemoteActions())
      subscriptions.add(
        versionEvent.on('new_version_available', (newVersion, ignoreVersion) => {
          const latestVersion =
            newVersion?.beta && settingState.setting['common.allowPreRelease'] ? newVersion.beta[0].version : newVersion?.version
          if (latestVersion == ignoreVersion) return
          void showUpdateModal()
        })
      )
      subscriptions.add(
        versionEvent.on('downloaded', () => {
          void showUpdateModal()
        })
      )

      void init()
    })
  })
}

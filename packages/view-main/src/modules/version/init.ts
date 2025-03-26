import { createUnsubscriptionSet } from '@/shared'
import { onConnected, onRelease } from '@/modules/app/shared'
import { getCurrentVersionInfo, registerRemoteActions, initCurrentVersionInfo } from './store/actions'

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

      void init()
    })
  })
}

import { createCommon } from './common'
import { createConfigurationStore } from './configuration'
import { createMusicList } from './musicList'
import { createPlayer } from './player'
import { createRequest } from './request'
import { createStore } from './storage'
// import { extensionState } from '../../../state'

export const createExposeObject = (extension: AnyListen.Extension.Extension) => {
  return {
    ...createCommon(extension),
    ...createRequest(extension),
    ...createStore(extension.dataDirectory),
    ...createConfigurationStore(extension),
    ...createMusicList(extension),
    ...createPlayer(extension),
    // async getConnectedClients() {
    //   return extensionState.remoteFuncs.getConnectedClients()
    // },
  } satisfies AnyListen.IPCExtension.PreloadIPCActions
}

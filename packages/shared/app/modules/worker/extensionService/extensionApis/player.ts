import { extensionState } from '../state'
import { cloneData } from './shared'
export const createPlayer = (extension: AnyListen.Extension.Extension) => {
  const player = {
    async getPlayInfo() {
      const data = await extensionState.remoteFuncs.getPlayInfo()
      return cloneData(data)
    },
    async playListAction(action: AnyListen.IPCPlayer.PlayListAction) {
      await extensionState.remoteFuncs.playListAction(cloneData(action))
    },
    async playHistoryListAction(action: AnyListen.IPCPlayer.PlayHistoryListAction) {
      await extensionState.remoteFuncs.playHistoryListAction(cloneData(action))
    },
    async playerAction(action: AnyListen.IPCPlayer.ActionPlayer) {
      await extensionState.remoteFuncs.playerAction(cloneData(action))
    },
  } as const
  if (!extension.grant.includes('player')) return player
  return {} as unknown as typeof player
}

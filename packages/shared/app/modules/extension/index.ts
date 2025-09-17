import { workers } from '../worker'
import { extensionEvent } from './event'
import { initListProvider, syncList as syncRemoteUserList } from './listProvider'
import { extensionState } from './state'

export const initExtensionModule = async () => {
  await initListProvider()
}

export { extensionEvent, extensionState }

export const syncUserList = async (id: string) => {
  const userLists = (await workers.dbService.getAllUserLists()).userList
  const targetList = userLists.find((l) => l.id === id)
  if (!targetList) throw new Error('list not found')
  if (targetList.type === 'remote') {
    return syncRemoteUserList(targetList)
  }
  if (targetList.type === 'online') {
    // TODO sync online list
    throw new Error('not implemented')
  }
  console.log('not sync list', targetList)
  throw new Error('not supported list type')
}

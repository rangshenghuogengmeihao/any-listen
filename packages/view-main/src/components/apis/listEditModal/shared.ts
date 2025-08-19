import { createUserList as createUserListRemote, getSubUserLists, updateUserList } from '@/modules/musicLibrary/store/actions'
import { musicLibraryState } from '@/modules/musicLibrary/store/state'
import { LIST_IDS } from '@any-listen/common/constants'

export const createUserList = async (listInfo: AnyListen.List.UserListInfo) => {
  const lists = getSubUserLists(null)
  let position: number
  if (listInfo.id) {
    if (listInfo.id == LIST_IDS.LOVE || listInfo.id == LIST_IDS.DEFAULT) {
      position = 0
    } else {
      position = lists.findIndex((l) => l.id == listInfo.id)
      if (position != -1) position = position + 1
    }
  } else {
    position = musicLibraryState.userLists.length
  }
  await createUserListRemote(position, listInfo)
}

export const editUserList = async (listInfo: AnyListen.List.UserListInfo) => {
  await updateUserList(listInfo)
}

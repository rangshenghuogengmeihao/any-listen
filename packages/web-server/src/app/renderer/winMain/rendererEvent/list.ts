/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { appState } from '@/app/app'
import { workers } from '@/app/worker'
import { broadcast } from '@/modules/ipc/websocket'
import {
  addFolderMusics,
  cancelAddFolderMusics,
  checkListExistMusic,
  getAllUserLists,
  getListMusics,
  getListScrollInfo,
  getMusicExistListIds,
  onMusicListAction,
  saveListScrollPosition,
  sendMusicListAction,
} from '@any-listen/app/modules/musicList'
import type { ExposeClientFunctions, ExposeServerFunctions } from '.'

// 暴露给前端的方法
export const createExposeList = () => {
  return {
    async getAllUserLists(event) {
      return getAllUserLists()
    },
    async getListMusics(event, listId) {
      return getListMusics(listId)
    },
    async getMusicExistListIds(event, musicId) {
      return getMusicExistListIds(musicId)
    },
    async checkListExistMusic(event, listId, musicId) {
      return checkListExistMusic(listId, musicId)
    },
    async listAction(event, action) {
      return sendMusicListAction(action)
    },
    async getListScrollPosition(event) {
      return getListScrollInfo()
    },
    async saveListScrollPosition(event, id, position) {
      return saveListScrollPosition(id, position)
    },
    async addFolderMusics(event, listId, filePaths, onEnd) {
      return addFolderMusics(
        listId,
        filePaths,
        onEnd,
        async (paths) => {
          return workers.utilService.createLocalMusicInfos(paths)
        },
        async (musicInfos) => {
          await sendMusicListAction({
            action: 'list_music_add',
            data: {
              id: listId,
              musicInfos,
              addMusicLocationType: appState.appSetting['list.addMusicLocationType'],
            },
          })
        }
      )
    },
    async cancelAddFolderMusics(event, taskId) {
      return cancelAddFolderMusics(taskId)
    },
  } satisfies Partial<ExposeClientFunctions>
}

// 暴露给后端的方法
export const createServerList = () => {
  const actions = {
    async listAction(action) {
      broadcast((socket) => {
        if (socket.winType != 'main' || !socket.isInited) return
        void socket.remoteQueueList.listAction(action)
      })
    },
  } satisfies Partial<ExposeServerFunctions>

  // eslint-disable-next-line @typescript-eslint/unbound-method
  onMusicListAction(actions.listAction)

  return actions
}

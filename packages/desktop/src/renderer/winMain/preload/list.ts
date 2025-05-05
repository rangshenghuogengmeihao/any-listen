import { ipcPreloadEvent } from '@any-listen/app/modules/ipcPreloadEvent'
import { createProxyCallback } from 'message2call'
import type { ExposeFunctions, MainCall } from '.'

// 暴露给后端的方法
export const createExposeList = () => {
  return {
    async listAction(event, action) {
      ipcPreloadEvent.listAction(action)
    },
  } satisfies Partial<ExposeFunctions>
}

// 暴露给前端的方法
export const createClientList = (main: MainCall) => {
  return {
    async getAllUserLists() {
      return main.getAllUserLists()
    },
    async getListMusics(id) {
      return main.getListMusics(id)
    },
    async getMusicExistListIds(listId) {
      return main.getMusicExistListIds(listId)
    },
    async checkListExistMusic(listId, musicId) {
      return main.checkListExistMusic(listId, musicId)
    },
    async listAction(action) {
      return main.listAction(action)
    },
    onListAction(listener) {
      ipcPreloadEvent.on('listAction', listener)
      return () => {
        ipcPreloadEvent.off('listAction', listener)
      }
    },
    async getListScrollPosition() {
      return main.getListScrollPosition()
    },
    async saveListScrollPosition(id, position) {
      return main.saveListScrollPosition(id, position)
    },
    async addFolderMusics(listId, filePaths, onEnd) {
      const proxyCallback = createProxyCallback((errorMessage?: string | null) => {
        proxyCallback.releaseProxy()
        onEnd(errorMessage)
      })
      return main.addFolderMusics(listId, filePaths, proxyCallback)
    },
    async cancelAddFolderMusics(taskId) {
      return main.cancelAddFolderMusics(taskId)
    },
  } satisfies Partial<AnyListen.IPC.ServerIPC>
}

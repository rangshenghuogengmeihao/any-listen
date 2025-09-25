import { extensionEvent } from '@/app/modules/extension'
import { getAllUserLists, getListMusics, sendMusicListAction } from '@any-listen/app/modules/musicList'
import { checkProxyCache, createProxy, writeProxyCache } from '@any-listen/app/modules/proxyServer'
import type { Options } from '@any-listen/nodejs/request'
import { createExtensionIconPublicPath, removeExtensionIconPublicPath } from '../fileSystem'
import { getPlayInfo, playerEvent } from '../player'
import { boxTools } from './clientTools'

/**
 * 暴露给扩展进程调用的方法
 */
export const exposedFuncs: AnyListen.IPCExtension.MainIPCActions = {
  async onExtensionEvent(action) {
    extensionEvent.extensionEvent(action)
  },
  async createProxyUrl(url, options) {
    return createProxy(url, options as Options)
  },
  async checkProxyCache(url) {
    return checkProxyCache(url)
  },
  async writeProxyCache(fileName, data) {
    return writeProxyCache(fileName, data)
  },

  async getPlayInfo() {
    return getPlayInfo()
  },
  async playerAction(action) {
    playerEvent.playerAction(action)
  },
  async playListAction(action) {
    await playerEvent.playListAction(action)
  },
  async playHistoryListAction(action) {
    await playerEvent.playHistoryListAction(action)
  },

  async getAllUserLists() {
    return getAllUserLists()
  },
  async getListMusics(listId) {
    return getListMusics(listId)
  },
  async musicListAction(action) {
    await sendMusicListAction(action)
  },

  async createExtensionIconPublicPath(filePath) {
    return createExtensionIconPublicPath(filePath)
  },
  async removeExtensionIconPublicPath(filePath) {
    removeExtensionIconPublicPath(filePath)
  },

  async showMessageBox(extId, key, options) {
    return boxTools.showBox(key, async (socket) => {
      return socket.remote.showMessageBox(extId, key, options)
    })
  },
  async showInputBox(extId, key, options) {
    return boxTools.showBox(key, async (socket) => {
      return socket.remote.showInputBox(extId, key, options)
    })
  },
  async showOpenBox(extId, key, options) {
    return boxTools.showBox(key, async (socket) => {
      return socket.remote.showOpenBox(extId, key, options)
    })
  },
  async showSaveBox(extId, key, options) {
    return boxTools.showBox(key, async (socket) => {
      return socket.remote.showSaveBox(extId, key, options)
    })
  },
  async closeMessageBox(key) {
    boxTools.closeBox(key)
  },
} as const

export type ExposedFuncs = typeof exposedFuncs

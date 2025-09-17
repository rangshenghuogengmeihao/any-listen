import { generateId, isUrl } from '@any-listen/common/utils'
import { hostContext } from './shared'
import type { WebDAVClientOptions } from './webdav'

const getPassword = async (url: string, username: string) => {
  const config = (await hostContext.getConfigs(['servers']))[0]
  if (!config) return ''
  const randomStr = generateId()
  for (let line of config.trim().split('\n')) {
    line = line.trim()
    line = line.replaceAll('\\,', randomStr)
    let [_url, _username, _password] = line.split(',').map((part) => part.replaceAll(randomStr, ',').trim())
    if (_url.endsWith('/')) _url = _url.slice(0, -1)
    if (url === _url && username === _username) return _password || ''
  }
  return ''
}

export const verifyForm = async (
  listInfo: AnyListen.List.UserListInfoByRemoteMeta | AnyListen.Music.MusicInfoOnline['meta']
): Promise<WebDAVClientOptions> => {
  if (typeof listInfo.url !== 'string' || !isUrl(listInfo.url)) {
    throw new Error(hostContext.i18n.t('exts.webdav.form.error.invalid_url'))
  }
  if (listInfo.url.endsWith('/')) {
    listInfo.url = listInfo.url.slice(0, -1)
  }
  return {
    url: listInfo.url as string,
    username: (listInfo.username as string) || '',
    password: (listInfo.password as string) || '',
    path: '',
  }
}

export const getWebDAVOptionsByListInfo = async (listInfo: AnyListen.List.UserListInfoByRemoteMeta) => {
  const options = await verifyForm(listInfo)
  options.password = await getPassword(options.url, options.username)
  options.path = (listInfo.directory as string) || '/'
  return options
}

export const getWebDAVOptionsByMusicInfo = async (musicInfo: AnyListen.Music.MusicInfoOnline) => {
  const options = await verifyForm(musicInfo.meta)
  if (!musicInfo.meta.path || typeof musicInfo.meta.path !== 'string') throw new Error('no path in musicInfo.meta')
  options.password = await getPassword(options.url, options.username)
  options.path = musicInfo.meta.path
  return options
}

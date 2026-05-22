import { install } from '@/components/apis/extensionDetail/shared'
import { showNotify } from '@/components/apis/notify'
import { getOnlineExtensionList } from '@/modules/extension/store/actions'
import { extensionState } from '@/modules/extension/store/state'
import { i18n } from '@/plugins/i18n'

export const viewTypes = ['installed', 'enabled', 'disabled', 'online'] as const
export const viewIcons = {
  installed: 'software_installer',
  enabled: 'gears',
  disabled: 'unavailable',
  online: 'online_store',
} as const

const getTargetOnlineExtension = async (id: string) => {
  if (!extensionState.onlineExtensionList.length) await getOnlineExtensionList()
  const targetExt = extensionState.onlineExtensionList.find((e) => e.id == id)
  return targetExt
}
export const installOrUpdate = async (ext: AnyListen.Extension.Extension | AnyListen.IPCExtension.OnlineListItem) => {
  const targetExt = 'installed' in ext ? ext : await getTargetOnlineExtension(ext.id)
  if (!targetExt) {
    showNotify(i18n.t('extension.install_failed', { name: ext.name, err: i18n.t('extension.not_found_in_online') }))
    return
  }
  await install(targetExt, targetExt.installed)
}

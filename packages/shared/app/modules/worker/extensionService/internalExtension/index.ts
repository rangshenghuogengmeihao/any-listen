import { createCommon } from '../extensionApis/common'
import { createConfigurationStore } from '../extensionApis/configuration'
import { createMusicUtils } from '../extensionApis/musicUtils'
import { createStore } from '../extensionApis/storage'
import { i18n } from '../i18n'
import { extensions } from './extensions'
import { createLogTools } from './shared'
import { internalExtensionContextState } from './state'

export { buildExtensionI18nMessage, getExtensionList } from './extensions'

export const loadExtension = async (extension: AnyListen.Extension.Extension) => {
  const setup = extensions.find((e) => e.pkg.id === extension.id)?.setup
  if (!setup) throw new Error(`Invalid Internal Extension: ${extension.id}`)
  const runStartTime = performance.now()

  const logcat = await createLogTools(extension)
  const extContext = await setup(extension, {
    logcat,
    i18n,
    ...createCommon(extension),
    ...createStore(extension.dataDirectory),
    ...createConfigurationStore(extension),
    ...createMusicUtils(extension),
  })

  internalExtensionContextState.contexts.set(extension.id, {
    extension,
    context: extContext,
    logcat,
  })
  return Math.round(performance.now() - runStartTime)
}

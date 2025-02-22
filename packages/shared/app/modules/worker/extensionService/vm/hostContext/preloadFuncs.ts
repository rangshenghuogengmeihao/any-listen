import { contextState } from './state'

export const callPreload = <T extends keyof AnyListen.ExtensionVM.PreloadCallActions>(
  extId: string,
  action: T,
  data: AnyListen.ExtensionVM.PreloadCallActions[T]
) => {
  const targetContext = contextState.vmContexts.get(extId)
  if (!targetContext) throw new Error(`context not found: ${extId}`)
  targetContext.vmContext.__ext_preload__!(targetContext.key, action, JSON.stringify(data))
}

export const triggerTimeout = (extId: string, id: number) => {
  callPreload(extId, 'trigger_timeout', id)
}

export const sendError = (extId: string, error: string) => {
  callPreload(extId, 'error', error)
}

export const updateLocale = (locale: AnyListen.Locale) => {
  for (const context of contextState.vmContexts.values()) {
    void context.preloadFuncs.updateLocale(locale)
  }
}

export const updateI18nMessage = () => {
  for (const context of contextState.vmContexts.values()) {
    void context.preloadFuncs.updateI18nMessage(context.extension.i18nMessages)
  }
}

// export const clientConnected = (id: string) => {
//   for (const context of contextState.vmContexts.values()) {
//     void context.preloadFuncs.clientConnectAction(id, true)
//   }
// }

// export const clientDisconnected = (id: string) => {
//   for (const context of contextState.vmContexts.values()) {
//     void context.preloadFuncs.clientConnectAction(id, false)
//   }
// }

export const resourceAction: AnyListen.IPCExtension.ResourceAction = async (action) => {
  const vmContext = contextState.vmContexts.get(action.data.extensionId)
  if (!vmContext) throw new Error('extension not found')
  return vmContext.preloadFuncs.resourceAction(
    // @ts-expect-error
    action
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendConfigUpdatedEvent = (extId: string, keys: string[], config: Record<string, any>) => {
  const targetContext = contextState.vmContexts.get(extId)
  if (!targetContext) throw new Error(`context not found: ${extId}`)
  void targetContext.preloadFuncs.configurationChanged(keys, config)
}

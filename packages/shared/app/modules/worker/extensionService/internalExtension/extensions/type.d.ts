import type { i18n } from '../../i18n'
import type { createBoxs, createLogTools } from '../shared'

export interface ExtensionContext {
  resourceAction?: <T extends keyof AnyListen.IPCExtension.ResourceAction>(
    action: T,
    params: Parameters<AnyListen.IPCExtension.ResourceAction[T]>[0]
  ) => Promise<Awaited<ReturnType<AnyListen.IPCExtension.ResourceAction[T]>>>
  listProviderAction?: <T extends keyof AnyListen.IPCExtension.ListProviderAction>(
    action: T,
    params: Parameters<AnyListen.IPCExtension.ListProviderAction[T]>[0]
  ) => Promise<Awaited<ReturnType<AnyListen.IPCExtension.ListProviderAction[T]>>>
}

export type Logcat = Awaited<ReturnType<typeof createLogTools>>
export type Boxs = Awaited<ReturnType<typeof createBoxs>>

export type ExtensionHostContext = {
  logcat: Logcat
  i18n: typeof i18n
} & Boxs &
  Pick<
    AnyListen.IPCExtension.PreloadIPCActions,
    'getItems' | 'setItems' | 'removeItems' | 'clearItems' | 'getConfigs' | 'setConfigs' | 'createProxyUrl' | 'writeProxyCache'
  >

import { EXTENSION } from '@any-listen/common/constants'
import { logFormat } from '@any-listen/common/tools'
import { dateFormat } from '@any-listen/common/utils'
import { createSimpleLogcat } from '@any-listen/nodejs/logs'

export const createLogTools = async (extension: AnyListen.Extension.Extension) => {
  const log = await createSimpleLogcat(extension.dataDirectory, EXTENSION.logFileName)
  const sendLog = (type: AnyListen.ExtensionVM.HostCallActions['logcat']['type'], messages: unknown[]) => {
    const info = {
      type,
      timestamp: Date.now(),
      id: extension.id,
      name: extension.name,
      message: messages
        .map((m) => (typeof m == 'string' ? m : m instanceof Error ? (m.stack ?? m.message) : JSON.stringify(m)))
        .join(' '),
    }
    if (import.meta.env.DEV) {
      console.log(`[ExtensionHost ${dateFormat(info.timestamp)} ${info.type.toUpperCase()} - ${info.id}] ${info.message}`)
    }
    log(logFormat(info))
  }
  return {
    debug(...args: unknown[]) {
      sendLog('debug', args)
    },
    info(...args: unknown[]) {
      sendLog('info', args)
    },
    warn(...args: unknown[]) {
      sendLog('warn', args)
    },
    error(...args: unknown[]) {
      sendLog('error', args)
    },
  } as const
}

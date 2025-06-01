import { appState, initAppEnv, sendInitedEvent } from '@/app'
import { isLinux } from '@any-listen/nodejs/index'
import { app } from 'electron'
import './shared/error'
import './shared/log'
// import registerModules from '@/modules'
import { initI18n } from './i18n'
import { initModules } from './modules'
import { initRenderers } from './renderer'
import { startCommonWorkers, startExtensionServiceWorker } from './worker'

let isInited = false
// 初始化应用
const init = async () => {
  console.log('init')
  await initAppEnv()
  initI18n()
  await startCommonWorkers(appState.dataPath)
  void startExtensionServiceWorker()
  await initModules()
  await initRenderers()

  // registerModules()
  if (app.isReady()) sendInitedEvent()
  else isInited = true
}

void app.whenReady().then(() => {
  // https://github.com/electron/electron/issues/16809
  if (isLinux) {
    setTimeout(() => {
      if (isInited) sendInitedEvent()
    }, 300)
  } else if (isInited) sendInitedEvent()
})

void init()

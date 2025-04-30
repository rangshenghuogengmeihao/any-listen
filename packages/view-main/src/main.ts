// import '@common/utils/rendererError'
import { mount } from 'svelte'
import { initWorkers } from './worker'

import 'virtual:svg-icons-register'
import './app.less'
import App from './App.svelte'
import { initNotify } from './components/apis/notify'
import { initTooltips } from './components/apis/tooltips/global'
import { connectIPC, registerModules } from './modules'

// import './components/base/VirtualizedList'
void initWorkers()

mount(App, {
  target: document.getElementById('root')!,
})
initNotify()

registerModules()
connectIPC()
initTooltips()

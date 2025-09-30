import { exposeWorker } from '../utils/worker'

import * as common from './common'
import * as list from './list'
import * as music from './music'

void exposeWorker<{
  inited: () => void
}>({
  ...common,
  ...music,
  ...list,
}).then(({ remote }) => {
  remote.inited()
})

export type workerUtilSeriveTypes = typeof common & typeof music & typeof list

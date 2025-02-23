import { workers } from '@/worker'
import { initResources as initResourcesModule } from '@any-listen/app/modules/resources'

export const initResources = async () => {
  initResourcesModule(workers.extensionService)
}

// export const

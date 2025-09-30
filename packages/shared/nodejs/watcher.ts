import chokidar from 'chokidar'
import { isMusicFile } from './music'

export type FileAction = 'add' | 'change' | 'unlink'
export const watchMusicDir = (
  dir: string,
  callback: (action: FileAction, path: string) => void,
  onReady: () => void,
  onError: (message: string) => void,
  options: { recursive?: boolean } = {}
) => {
  // console.log(`Start watching music dir: ${dir}, recursive: ${options.recursive ? 'yes' : 'no'}`)
  const watcher = chokidar.watch(dir, {
    ignored: (filePath, stats) => {
      if (stats && !stats.isDirectory() && !isMusicFile(filePath)) {
        return true
      }
      return false
    },
    persistent: true,
    ignoreInitial: false,
    depth: options.recursive ? 5 : 0,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 200,
    },
  })

  watcher.on('all', (event, path) => {
    // console.log(`File ${event}: ${path}`)
    callback(event as FileAction, path)
  })

  watcher.on('ready', () => {
    // console.log(`Initial scan complete. Watching for changes in: ${dir}`)
    onReady()
  })

  watcher.on('error', (error) => {
    console.error('Watcher error:', error)
    onError(error instanceof Error ? error.message : String(error))
  })

  return async () => {
    await watcher.close()
  }
}

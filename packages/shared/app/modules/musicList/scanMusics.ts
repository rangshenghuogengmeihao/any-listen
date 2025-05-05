import { MEDIA_FILE_TYPES } from '@any-listen/common/constants'
import fs from 'node:fs'
import path from 'node:path'

const musicExtensions = MEDIA_FILE_TYPES.map((ext) => `.${ext}`)
const isMusicFile = (filePath: string): boolean => {
  return musicExtensions.includes(path.extname(filePath).toLowerCase())
}

/**
 * scans a directory for music files.
 * @param dirs - The directory to scan for music files
 * @param onFiles - A callback function that is called with the array of file paths
 * @param onEnd - A callback function that is called when the scan is complete
 * returns a function that can be called to cancel the scan
 */
export const scanFolderMusics = (
  dirs: string[],
  onFiles: (paths: string[]) => Promise<void>,
  onEnd: (canceled: boolean) => void
) => {
  let isCancelled = false
  const scannedPaths = new Set<string>()
  const shouldSkipPath = (directory: string): boolean => {
    const normalizedDir = path.resolve(directory)
    if (scannedPaths.has(normalizedDir)) return true
    scannedPaths.add(normalizedDir)
    return false
  }
  const scanBFS = async (dir: string): Promise<void> => {
    const directoryQueue: string[] = [dir]

    while (directoryQueue.length) {
      if (isCancelled) return
      const directory = directoryQueue.shift()!
      if (shouldSkipPath(directory)) continue

      try {
        const names = await fs.promises.readdir(directory)
        const musicFilesInCurrentDir: string[] = []

        for (const name of names) {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (isCancelled) return
          const fullPath = path.join(directory, name)
          try {
            const stat = await fs.promises.stat(fullPath)
            if (stat.isDirectory()) {
              directoryQueue.push(fullPath)
            } else if (isMusicFile(name)) {
              musicFilesInCurrentDir.push(fullPath)
            }
          } catch (err) {
            console.error(`Error accessing ${fullPath}:`, err)
          }
        }

        // 只在目录中有音乐文件时调用回调
        if (musicFilesInCurrentDir.length > 0) {
          await onFiles(musicFilesInCurrentDir)
        }
      } catch (err) {
        console.error(`Error scanning directory ${directory}:`, err)
      }
    }
  }

  setImmediate(async () => {
    try {
      for (const dir of dirs) await scanBFS(dir)
    } finally {
      onEnd(isCancelled)
    }
  })
  return () => {
    isCancelled = true
  }
}

import { DB_NAME } from '@any-listen/common/constants'
import { renameSync } from 'node:fs'
import path from 'node:path'

export const backupDB = (dataPath: string, backupPath: string) => {
  const dbPath = path.join(dataPath, DB_NAME)
  try {
    renameSync(dbPath, backupPath)
  } catch {}
  try {
    renameSync(`${dbPath}-wal`, `${backupPath}-wal`)
  } catch {}
  try {
    renameSync(`${dbPath}-shm`, `${backupPath}-shm`)
  } catch {}
}

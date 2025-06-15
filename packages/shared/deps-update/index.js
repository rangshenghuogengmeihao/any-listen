import chalk from 'chalk'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { run as runNcu } from 'npm-check-updates'

const root = path.join(import.meta.dirname, '../../../')

const packages = [
  '.',
  'packages/desktop',
  'packages/view-main',
  'packages/web-server',
  ...fs.readdirSync(path.join(root, 'packages/shared')).map((p) => `packages/shared/${p}`),
].map((p) => path.join(root, p, 'package.json'))

const configs = createRequire(path.join(import.meta.dirname, import.meta.filename))(path.join(root, '.ncurc.cjs'))

/**
 *
 * @param {string} filePath
 * @returns
 */
const getProjectName = (filePath) => {
  let relativePath = filePath.replace(root, '')
  relativePath = relativePath.startsWith(path.sep) ? relativePath.slice(1) : relativePath
  return relativePath.replace(`${path.sep}package.json`, '')
}
let logs = ''
/**
 *
 * @param {string} filePath
 * @param {Record<string, string>} oldPkgs
 * @param {Array<[string, string]>} updatedPkgs
 */
const addLog = async (filePath, oldPkgs, updatedPkgs) => {
  if (!updatedPkgs.length) return
  logs += `${getProjectName(filePath)}:
${updatedPkgs.map(([k, v]) => `    ${chalk.blue(k)}: ${chalk.gray(oldPkgs[k])} → ${chalk.green(v)}`).join('\n')}
`
}
const run = async () => {
  for (const packageFile of packages) {
    const pkg = JSON.parse((await fs.promises.readFile(packageFile, 'utf-8')).toString())
    const oldPkgs = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) }
    const updatedPkgs = {}
    console.log(`Checking ${chalk.blue(getProjectName(packageFile))}...`)
    for (const config of configs) {
      const updated = await runNcu({
        packageFile,
        upgrade: true,
        jsonUpgraded: true,
        ...config,
      })
      if (typeof updated == 'object') {
        Object.assign(updatedPkgs, updated)
      } else console.log(updated)
    }
    addLog(packageFile, oldPkgs, Object.entries(updatedPkgs))
  }
  if (logs.length) console.log(logs.trim())
}

run()

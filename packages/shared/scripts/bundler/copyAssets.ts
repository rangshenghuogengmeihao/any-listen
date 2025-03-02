import fs from 'node:fs'
import path from 'node:path'
import type { Target } from './utils'

const rootPath = path.join(__dirname, '../../../../')

const assetsAll = {
  electron: {
    dev: [
      [
        path.join(rootPath, 'packages/shared/theme/theme_images'),
        path.join(rootPath, 'packages/electron/dist/electron/theme_images'),
      ],
    ],
    prod: [
      [
        path.join(rootPath, 'packages/shared/theme/theme_images'),
        path.join(rootPath, 'packages/electron/dist/view-main/theme_images'),
      ],
      [path.join(rootPath, 'packages/electron/src/static'), path.join(rootPath, 'packages/electron/dist/static')],
    ],
  },
  web: {
    dev: [
      [
        path.join(rootPath, 'packages/shared/theme/theme_images'),
        path.join(rootPath, 'packages/web-server/server/public/theme_images'),
      ],
    ],
    prod: [
      [path.join(rootPath, 'packages/shared/theme/theme_images'), path.join(rootPath, 'build/public/theme_images')],
      [path.join(rootPath, 'packages/web-server/index.cjs'), path.join(rootPath, 'build/index.cjs')],
      [
        path.join(rootPath, 'packages/web-server/node_modules/better-sqlite3/lib'),
        path.join(rootPath, 'build/node_modules/better-sqlite3/lib'),
      ],
      [
        path.join(rootPath, 'packages/web-server/node_modules/better-sqlite3/package.json'),
        path.join(rootPath, 'build/node_modules/better-sqlite3/package.json'),
      ],
      [
        path.join(rootPath, 'packages/web-server/node_modules/better-sqlite3/build/Release/better_sqlite3.node'),
        path.join(rootPath, 'build/node_modules/better-sqlite3/build/Release/better_sqlite3.node'),
      ],
      // [
      //   path.join(rootPath, 'packages/web-server/node_modules/node-gyp-build'),
      //   path.join(rootPath, 'build/node_modules/node-gyp-build'),
      // ],
      [
        path.join(rootPath, 'packages/web-server/node_modules/bufferutil/*'),
        path.join(rootPath, 'build/node_modules/bufferutil'),
      ],
      [
        path.join(rootPath, 'packages/web-server/node_modules/utf-8-validate/*'),
        path.join(rootPath, 'build/node_modules/utf-8-validate'),
      ],
    ],
  },
  mobile: {
    dev: [],
    prod: [],
  },
} as const

export default async (type: Target) => {
  const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
  const assets = assetsAll[type][env]
  for (const [from, to] of assets) {
    if (from.endsWith('*')) {
      const dir = from.replace('*', '')
      const files = await fs.promises.readdir(dir)
      for await (const file of files) {
        await fs.promises.cp(path.join(dir, file), path.join(to, file), {
          recursive: true,
        })
      }
    } else {
      await fs.promises.cp(from, to, {
        recursive: true,
      })
    }
  }
}

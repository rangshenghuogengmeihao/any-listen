const minor = ['electron', '@types/node', 'better-sqlite3']
const newest = ['electron-builder', 'electron-updater']
const patch = []

module.exports = [
  {
    reject: [...newest, ...minor, ...patch],
  },
  {
    target: 'newest',
    filter: newest,
  },
  // {
  //   target: 'patch',
  //   filter: [],
  // },
  {
    target: 'minor',
    filter: minor,
  },
]

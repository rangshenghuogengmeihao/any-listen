process.env.NODE_ENV = 'production'
process.env.MODE = 'desktop'
// process.env.VITE_CJS_TRACE = 'true'
process.env.VITE_CJS_IGNORE_WARNING = 'true'

void import('./bundler/pack-desktop')

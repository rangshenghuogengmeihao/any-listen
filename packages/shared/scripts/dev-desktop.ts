process.env.NODE_ENV = 'development'
process.env.MODE = 'desktop'
// process.env.VITE_CJS_TRACE = 'true'
process.env.VITE_CJS_IGNORE_WARNING = 'true'
process.env.WS_NO_BUFFER_UTIL = 'true'
process.env.WS_NO_UTF_8_VALIDATE = 'true'

void import('./bundler/runner-desktop')

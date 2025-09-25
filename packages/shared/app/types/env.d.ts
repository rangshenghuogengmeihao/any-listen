/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IS_WEB?: string
  readonly VITE_IS_DESKTOP?: string
  readonly VITE_IS_MAC?: string
  readonly VITE_IS_WINDOWS?: string
  readonly VITE_IS_LINUX?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

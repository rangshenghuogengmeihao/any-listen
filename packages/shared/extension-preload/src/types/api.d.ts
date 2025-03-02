import type { ExtensionAPIEventType } from '@/event'

interface IPCActionBase<A> {
  action: A
}
interface IPCActionData<A, D> extends IPCActionBase<A> {
  data: D
}
interface CommonParams {
  extensionId: string
  source: string
}
interface CommonListParams extends CommonParams {
  page: number
  limit: number
}
interface LyricSearchParams extends CommonParams {
  interval: number
  keyword: string
}
interface SearchParams extends CommonListParams {
  keyword: string
}
interface ListDetailParams extends CommonListParams {
  id: string
}
interface SonglistListParams extends CommonListParams {
  sort: string
  tag: string
}
interface ListCommonResult<T> {
  list: T[]
  total: number
  page: number
  limit: number
  // source: string
}
interface MusicCommonParams extends CommonParams {
  musicInfo: AnyListen.Music.MusicInfoOnline
}
interface SongListItem {
  play_count: string
  id: string
  author: string
  name: string
  time?: string
  img: string
  // grade: basic.favorcnt / 10,
  desc: string | null
  total?: string
}

interface CommonItem {
  id: string
  name: string
}
type TagItem = CommonItem
interface TagGroupItem {
  name: string
  list: CommonItem[]
}

type BoardItem = CommonItem

declare global {
  namespace AnyListen_API {
    type Locale =
      | 'ar-sa'
      | 'cs-cz'
      | 'da-dk'
      | 'de-de'
      | 'el-gr'
      | 'en-au'
      | 'en-gb'
      | 'en-ie'
      | 'en-us'
      | 'en-za'
      | 'es-es'
      | 'es-mx'
      | 'fi-fi'
      | 'fr-ca'
      | 'fr-fr'
      | 'he-il'
      | 'hi-in'
      | 'hu-hu'
      | 'id-id'
      | 'it-it'
      | 'ja-jp'
      | 'ko-kr'
      | 'nl-be'
      | 'nl-nl'
      | 'no-no'
      | 'pl-pl'
      | 'pt-br'
      | 'pt-pt'
      | 'ro-ro'
      | 'ru-ru'
      | 'sk-sk'
      | 'sv-se'
      | 'th-th'
      | 'tr-tr'
      | 'zh-cn'
      | 'zh-hk'
      | 'zh-tw'

    type Platform = 'mac' | 'linux' | 'windows' | 'android' | 'ios'
    type Architecture = 'arm' | 'arm64' | 'x86' | 'x64'
    type ClientType = 'desktop' | 'web' | 'mobile'
    type Quality = '128k' | '320k' | 'flac' | 'flac24bit' | '192k' | 'wav' | 'dobly' | 'master'

    type ParamsData = Record<string, string | number | null | undefined | boolean>
    interface RequestOptions {
      method?: 'get' | 'head' | 'delete' | 'patch' | 'post' | 'put'
      timeout?: number
      headers?: Record<string, string>
      body?: string
      form?: ParamsData
      params?: Record<string, string>
      // formData?: Options['fo']
      // binary?: Options['method']
    }
    interface Response<Resp> {
      statusCode?: number
      statusMessage?: string
      headers: Record<string, string | string[] | undefined>
      raw: ArrayBuffer
      body: Resp
    }

    type BufferFormat = 'binary' | 'base64' | 'hex' | 'utf-8' | 'utf8'
    interface BufferToStringTypes {
      binary: number[] | Uint8Array
      base64: string
      hex: string
      utf8: string
      'utf-8': string
    }

    type AES_MODE = 'CBC_128_PKCS7Padding' | 'ECB_128_NoPadding'
    type RSA_PADDING = 'RSA_PKCS1_OAEP_PADDING' | 'RSA_NO_PADDING'

    interface MessageButton {
      /** A short title like 'Retry', 'Open Log' etc. */
      text: string
      link?: string
    }
    interface MessageDialogOptions {
      signal?: unknown
      textSelect?: boolean
      type?: 'info' | 'warning' | 'error'
      /** Human-readable detail message that is rendered less prominent. Note that detail is only shown for modal messages. */
      detail?: string
      /** Indicates that this message should be modal. */
      modal?: boolean
      buttons?: MessageButton[]
    }

    interface InputDialogOptions {
      signal?: unknown
      /** Controls if a password input is shown. Password input hides the typed text. */
      password?: boolean
      /** An optional string to show as placeholder in the input box to guide the user what to type. */
      placeHolder?: string
      /** The text to display underneath the input box. */
      prompt?: string
      /** An optional string that represents the title of the input box. */
      title?: string
      /** The value to pre-fill in the input box. */
      value?: string
      /** An optional function that will be called to validate input and to give a hint to the user. */
      validateInput?: (value: string) => null | undefined | string
    }

    interface OpenDialogOptions {
      signal?: unknown
      /** The resource the dialog shows when opened. */
      defaultPath?: string
      /** A human-readable string for the open button. */
      openLabel?: string
      /** Allow to select files, defaults to `true`. */
      canSelectFiles?: boolean
      /** Allow to select folders, defaults to `false`. */
      canSelectFolders?: boolean
      /** Allow to select many files or folders. */
      canSelectMany?: boolean
      /**
       *  A set of file filters that are used by the dialog. Each entry is a human-readable label,
       * like "TypeScript", and an array of extensions, for example:
       * ```ts
       * {
       *   'Images': ['png', 'jpg'],
       *   'TypeScript': ['ts', 'tsx']
       * }
       * ```
       */
      filters?: Record<string, string[]>
      /**
       * Dialog title.
       *
       * This parameter might be ignored, as not all operating systems display a title on open dialogs
       * (for example, macOS).
       */
      title?: string
    }

    interface SaveDialogOptions {
      signal?: unknown
      /** The resource the dialog shows when opened. */
      defaultPath?: string
      /** A human-readable string for the save button. */
      saveLabel?: string
      /**
       * A set of file filters that are used by the dialog. Each entry is a human-readable label,
       * like "TypeScript", and an array of extensions, for example:
       * ```ts
       * {
       *   'Images': ['png', 'jpg'],
       *   'TypeScript': ['ts', 'tsx']
       * }
       * ```
       */
      filters?: Record<string, string[]>
      /**
       * Dialog title.
       *
       * This parameter might be ignored, as not all operating systems display a title on save dialogs
       * (for example, macOS).
       */
      title?: string
    }

    /** 环境相关 */
    interface Env {
      /** 客户端类型 */
      readonly clientType: ClientType
      /** 扩展系统版本号 */
      readonly version: string
      /** 运行平台 */
      readonly platform: Platform
      /** 架构 */
      readonly arch: Architecture
      /** 语言 */
      readonly locale: Locale
      /** 扩展公钥 */
      readonly publicKey: string
      /** 扩展版本号 */
      readonly extensionVersion: string
    }
    /** 应用相关 */
    interface App {
      showMessage: (message: string, options?: MessageDialogOptions) => Promise<number | undefined>
      showInput: (options: InputDialogOptions) => Promise<string | undefined>
      showOpenDialog: (options: OpenDialogOptions) => Promise<string | string[] | undefined>
      showSaveDialog: (options: SaveDialogOptions) => Promise<string | undefined>
      // getConnectedClient: () => Promise<string[]>
    }
    interface MusicList {
      getAllUserLists: () => Promise<AnyListen.List.MyAllList>
      getListMusics: (listId: string) => Promise<AnyListen.Music.MusicInfo[]>
      listAction: (action: AnyListen.IPCList.ActionList) => Promise<void>
    }
    interface PlayInfo {
      info: {
        time: number
        maxTime: number
        index: number
        historyIndex: number
      }
      list: Array<{
        /**
         * 当前信息唯一ID
         */
        itemId: string
        /**
         * 当前播放歌曲的列表 id
         */
        musicInfo: AnyListen.Music.MusicInfo
        /**
         * 当前播放歌曲的列表 id
         */
        listId: string
        /**
         * 是否在线列表
         */
        isOnline: boolean
        /**
         * 是否属于 “稍后播放”
         */
        playLater: boolean
        /**
         * 是否已播放
         */
        played: boolean
      }>
      listId: string | null
      historyList: Array<{
        id: string
        time: number
      }>
    }
    interface Player {
      /** 获取播放信息 */
      getPlayInfo: () => Promise<PlayInfo>
      playListAction: (action: AnyListen.IPCPlayer.PlayListAction) => Promise<void>
      playerAction: (action: AnyListen.IPCPlayer.ActionPlayer) => Promise<void>
      playHistoryListAction: (action: AnyListen.IPCPlayer.PlayHistoryListAction) => Promise<void>
    }
    interface MusicUrlInfo {
      url: string
      quality: Quality
    }

    interface ResourceAction {
      // (action: IPCActionData<'tipSearch', CommonParams>): Promise<string[]>
      // (action: IPCActionData<'hotSearch', CommonParams>): Promise<string[]>
      (action: IPCActionData<'musicSearch', SearchParams>): Promise<ListCommonResult<AnyListen.Music.MusicInfoOnline>>
      (action: IPCActionData<'musicPic', MusicCommonParams>): Promise<string>
      (action: IPCActionData<'musicUrl', MusicCommonParams>): Promise<MusicUrlInfo>
      (action: IPCActionData<'lyric', MusicCommonParams>): Promise<AnyListen.Music.LyricInfo>
      (action: IPCActionData<'lyricSearch', LyricSearchParams>): Promise<AnyListen.Music.LyricInfo[]>
      // (action: IPCActionData<'songlistSearch', SearchParams>): Promise<ListCommonResult<SongListItem>>
      // (action: IPCActionData<'songlistSorts', CommonParams>): Promise<TagItem[]>
      // (action: IPCActionData<'songlistTags', CommonParams>): Promise<TagGroupItem[]>
      // (action: IPCActionData<'songlist', SonglistListParams>): Promise<ListCommonResult<SongListItem>>
      // (action: IPCActionData<'songlistDetail', ListDetailParams>): Promise<ListCommonResult<AnyListen.Music.MusicInfoOnline>>
      // (action: IPCActionData<'leaderboard', CommonParams>): Promise<TagGroupItem[]>
      // (action: IPCActionData<'leaderboardDate', SonglistListParams>): Promise<ListCommonResult<AnyListen.Music.MusicInfoOnline>>
      // (action: IPCActionData<'leaderboardDetail', SonglistListParams>): Promise<ListCommonResult<AnyListen.Music.MusicInfoOnline>>
    }
    interface Logcat {
      debug: (...args: unknown[]) => void
      info: (...args: unknown[]) => void
      warn: (...args: unknown[]) => void
      error: (...args: unknown[]) => void
    }
    interface Storage {
      getItem: <T>(key: string) => Promise<T>
      getItems: <T extends unknown[]>(keys: string[]) => Promise<T>
      setItem: (key: string, value: unknown) => Promise<void>
      setItems: <T extends Array<[string, unknown]>>(datas: T) => Promise<void>
      removeItem: (key: string) => Promise<void>
      removeItems: (keys: string[]) => Promise<void>
      clearItems: () => Promise<void>
    }
    interface Buffer {
      from: (input: string | number[], encoding?: BufferFormat) => Uint8Array
      bufToString: <T extends BufferFormat>(buf: number[] | Uint8Array, format: T) => BufferToStringTypes[T]
    }
    interface Crypto {
      aesEncrypt: (mode: AES_MODE, b64Data: string, b64Key: string, b64iv: string) => string
      rsaEncrypt: (mode: RSA_PADDING, b64Data: string, b64Key: string) => string
      randomBytes: (size: number) => Uint8Array
    }
    interface Configuration {
      getConfigs: (key: string[]) => Promise<string[]>
      setConfigs: (datas: Array<[string, string]>) => Promise<void>
    }
    interface API {
      env: Env
      app: App
      musicList: MusicList
      player: Player
      /** 事件 */
      onEvent: ExtensionAPIEventType['on']
      /** http 请求 */
      request: <Resp = unknown>(url: string, options?: RequestOptions) => Promise<Response<Resp>>
      t: (key: string, data?: Record<string, string | number | null | undefined>) => string
      logcat: Logcat
      storage: Storage
      configuration: Configuration
      registerResourceAction: (handler: ResourceAction) => void
      utils: {
        buffer: Buffer
        crypto: Crypto
      }
    }
  }
}

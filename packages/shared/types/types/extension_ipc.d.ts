declare namespace AnyListen {
  namespace IPCExtension {
    interface EventExtensionLoadError {
      id: string
      message: string
    }
    interface EventExtensionEnabled {
      id: string
      enabled: boolean
    }
    interface EventExtensionLoaded {
      id: string
      loadTimestamp: number
    }
    interface EventExtensionSettingUpdated {
      id: string
      keys: string[]
      setting: Record<string, unknown>
    }
    type EventExtension =
      | IPCAction<'loadListStart'>
      | IPCAction<'loadListEnd'>
      | IPCAction<'starting'>
      | IPCAction<'started'>
      | IPCAction<'crash', string>
      | IPCAction<'error', string>
      | IPCAction<'loading', string>
      | IPCAction<'enabled', EventExtensionEnabled>
      | IPCAction<'loadError', EventExtensionLoadError>
      | IPCAction<'loaded', EventExtensionLoaded>
      | IPCAction<'stoping', string>
      | IPCAction<'stoped', string>
      | IPCAction<'listAdd', Extension.Extension>
      | IPCAction<'listRemove', string>
      | IPCAction<'listUpdate', Extension.Extension>
      | IPCAction<'listSet', Extension.Extension[]>
      | IPCAction<'logOutput', LogInfo>
      | IPCAction<'resourceUpdated', Extension.ResourceList>
      | IPCAction<'extenstionSettingUpdated', EventExtensionSettingUpdated>

    interface CommonParams {
      extensionId: string
      source: string
    }
    interface CommonListParams extends CommonParams {
      page: number
      limit: number
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
      musicInfo: Music.MusicInfoOnline
    }

    interface ResourceAction {
      (action: IPCActionData<'tipSearch', CommonParams>): Promise<string[]>
      (action: IPCActionData<'hotSearch', CommonParams>): Promise<string[]>
      (action: IPCActionData<'musicSearch', SearchParams>): Promise<ListCommonResult<Music.MusicInfoOnline>>
      (action: IPCActionData<'musicPic', MusicCommonParams>): Promise<string>
      (action: IPCActionData<'musicUrl', MusicCommonParams>): Promise<string>
      (action: IPCActionData<'lyricSearch', MusicCommonParams>): Promise<Music.LyricInfo[]>
      (action: IPCActionData<'lyric', MusicCommonParams>): Promise<Music.LyricInfo>
      (action: IPCActionData<'songlistSearch', SearchParams>): Promise<ListCommonResult<Resource.SongListItem>>
      (action: IPCActionData<'songlistSorts', CommonParams>): Promise<Resource.TagItem[]>
      (action: IPCActionData<'songlistTags', CommonParams>): Promise<Resource.TagGroupItem[]>
      (action: IPCActionData<'songlist', SonglistListParams>): Promise<ListCommonResult<Resource.SongListItem>>
      (action: IPCActionData<'songlistDetail', ListDetailParams>): Promise<ListCommonResult<Music.MusicInfoOnline>>
      (action: IPCActionData<'leaderboard', CommonParams>): Promise<Resource.TagGroupItem[]>
      // (action: IPCActionData<'leaderboardDate', SonglistListParams>): Promise<ListCommonResult<AnyListen.Music.MusicInfoOnline>>
      (action: IPCActionData<'leaderboardDetail', SonglistListParams>): Promise<ListCommonResult<Music.MusicInfoOnline>>
    }
    // type ResourceAction = IPCActionFunc<'tipSearch', string, string[]>
    // | IPCActionFunc<'hotSearch', string, string[]>
    // | IPCActionFunc<'musicSearch', SearchParams, ListCommonResult<AnyListen.Music.MusicInfoOnline>>
    // | IPCActionFunc<'musicPic', MusicCommonParams, string>
    // | IPCActionFunc<'musicUrl', MusicCommonParams, string>
    // | IPCActionFunc<'lyricSearch', MusicCommonParams, AnyListen.Music.LyricInfo[]>
    // | IPCActionFunc<'lyric', MusicCommonParams, AnyListen.Music.LyricInfo>
    // | IPCActionFunc<'songListSearch', SearchParams, ListCommonResult<AnyListen.Resource.SongListItem>>
    // | IPCActionFunc<'songListSorts', string, AnyListen.Resource.TagItem[]>
    // | IPCActionFunc<'songListTags', string, AnyListen.Resource.TagGroupItem[]>
    // | IPCActionFunc<'songList', SonglistListParams, ListCommonResult<AnyListen.Resource.SongListItem>>
    // | IPCActionFunc<'songListDetail', ListDetailParams, ListCommonResult<AnyListen.Music.MusicInfoOnline>>
    // | IPCActionFunc<'leaderboard', string, AnyListen.Resource.TagGroupItem[]>
    // | IPCActionFunc<'leaderboardDate', SonglistListParams, ListCommonResult<AnyListen.Music.MusicInfoOnline>>
    // | IPCActionFunc<'leaderboardDetail', SonglistListParams, ListCommonResult<AnyListen.Music.MusicInfoOnline>>
    // | IPCActionFunc<'albumSearch', SearchParams, ListCommonResult<AnyListen.Resource.SongListItem>>
    // | IPCActionFunc<'albumSinger', SonglistListParams, ListCommonResult<AnyListen.Resource.SongListItem>>
    // | IPCActionFunc<'albumDetail', ListDetailParams, ListCommonResult<AnyListen.Music.MusicInfoOnline>>

    interface OnlineListFilterOptions {
      page: number
      limit: number
    }
    interface OnlineListResult {
      limit: number
      page: number
      total: number
      list: Extension.OnlineExtension[]
    }
    interface LastLog {
      id: string
      name: string
      logs: string
    }
    type ServerActions = WarpPromiseRecord<{
      getExtensionErrorMessage: () => string | null
      getExtensionList: () => Extension.Extension[]
      getOnlineExtensionList: (options: OnlineListFilterOptions) => OnlineListResult
      downloadAndParseExtension: (url: string, manifest?: Extension.Manifest) => Extension.Extension
      installExtension: (tempExtension: Extension.Extension) => Extension.Extension
      updateExtension: (tempExtension: Extension.Extension) => Extension.Extension
      startExtension: (id: string) => void
      enableExtension: (id: string) => void
      disableExtension: (id: string) => void
      restartExtension: (id: string) => void
      uninstallExtension: (id: string) => void
      restartExtensionHost: () => void
      getResourceList: () => Extension.ResourceList
      getExtensionLastLogs: (id?: string) => LastLog[]
      getAllExtensionSettings: () => Promise<Extension.ExtensionSetting[]>
      updateExtensionSettings: (extId: string, config: Record<string, any>) => Promise<void>
      resourceAction: ResourceAction
    }>
    type ServerIPCActions<Socket = undefined> = IPC.WarpIPCHandlerActions<Socket, ServerActions>

    type ClientActions = WarpPromiseRecord<{
      extensionEvent: (action: EventExtension) => void
    }>
    type ClientIPCActions<Socket = undefined> = IPC.WarpIPCHandlerActions<Socket, ClientActions>

    // main process funcs, exposed to extension worker
    interface MainIPCActions {
      onExtensionEvent: (action: EventExtension) => Promise<void>
      // getConnectedClients: () => Promise<string[]>
      // showMessage: (message: string) => Promise<string[]>

      getAllUserLists: () => Promise<List.MyAllList>
      getListMusics: (listId: string) => Promise<Music.MusicInfo[]>
      musicListAction: (action: IPCList.ActionList) => Promise<void>

      getPlayInfo: () => Promise<IPCPlayer.PlayInfo>
      playListAction: (action: IPCPlayer.PlayListAction) => Promise<void>
      playHistoryListAction: (action: IPCPlayer.PlayHistoryListAction) => Promise<void>
      playerAction: (action: IPCPlayer.ActionPlayer) => Promise<void>

      /** 显示消息弹窗 */
      showMessageBox: (extensionId: string, key: string, options: IPCCommon.MessageDialogOptions) => Promise<number>
      showInputBox: (extensionId: string, key: string, options: IPCCommon.InputDialogOptions) => Promise<string | undefined>
      showOpenBox: (
        extensionId: string,
        key: string,
        options: IPCCommon.OpenDialogOptions
      ) => Promise<string | string[] | undefined>
      showSaveBox: (extensionId: string, key: string, options: IPCCommon.SaveDialogOptions) => Promise<string | undefined>
      closeMessageBox: (key: string) => Promise<void>
    }

    interface RequestOptions {
      method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH'
      query?: Record<string, string | number | null | undefined | boolean>
      headers?: Record<string, string | string[]>
      timeout?: number
      maxRedirect?: number
      signal?: AbortController['signal']
      json?: Record<string, unknown>
      form?: Record<string, string | number | null | undefined | boolean>
      binary?: Uint8Array
      text?: string
      formdata?: Record<string, string | Uint8Array>
      xml?: string
      needRaw?: boolean
    }
    interface Response<Resp> {
      statusCode?: number
      // statusMessage?: string
      headers: Record<string, string | string[] | undefined>
      raw: Uint8Array
      body: Resp
    }
    interface RespCallback<Resp> {
      (error: null, response: Response<Resp>): void
      (error: Error, response: null): void
    }

    // extension worker funcs, exposed to extension vm
    interface PreloadIPCActions {
      showMessageBox: (key: string, options: IPCCommon.MessageDialogOptions) => Promise<number>
      showInputBox: (key: string, options: IPCCommon.InputDialogOptions) => Promise<string | undefined>
      showOpenBox: (key: string, options: IPCCommon.OpenDialogOptions) => Promise<string | string[] | undefined>
      showSaveBox: (key: string, options: IPCCommon.SaveDialogOptions) => Promise<string | undefined>
      closeMessageBox: (key: string) => void

      request: <Resp = unknown>(url: string, options?: RequestOptions) => Promise<Response<Resp>>
      getItems: (keys: string[]) => Promise<string[]>
      setItems: <T extends Array<[string, string]>>(datas: T) => Promise<void>
      removeItems: (keys: string[]) => Promise<void>
      clearItems: () => Promise<void>
      getConfigs: (key: string[]) => Promise<string[]>
      setConfigs: (datas: Array<[string, string]>) => Promise<void>
      // getConnectedClients: () => Promise<string[]>

      getPlayInfo: () => Promise<IPCPlayer.PlayInfo>
      playListAction: (action: IPCPlayer.PlayListAction) => Promise<void>
      playerAction: (action: IPCPlayer.ActionPlayer) => Promise<void>
      playHistoryListAction: (action: IPCPlayer.PlayHistoryListAction) => Promise<void>

      getAllUserLists: () => Promise<List.MyAllList>
      getListMusics: (listId: string) => Promise<Music.MusicInfo[]>
      listAction: (action: IPCList.ActionList) => Promise<void>
    }

    // extension vm funcs, exposed to extension worker
    interface ExtensionIPCActions {
      updateLocale: (locale: Locale) => void
      updateI18nMessage: (message: Record<string, string>) => void
      musicListAction: (action: IPCList.ActionList) => void
      playerEvent: (event: IPCPlayer.PlayerEvent) => void
      playListAction: (action: IPCPlayer.PlayListAction) => void
      playHistoryListAction: (action: IPCPlayer.PlayHistoryListAction) => void
      configurationChanged: (keys: string[], config: Record<string, any>) => void
      // clientConnectAction: (id: string, isConnected: boolean) => void
      resourceAction: ResourceAction
    }
  }
}

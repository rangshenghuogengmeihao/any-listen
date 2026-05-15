export interface MenuSelectInfo {
  listId: string
  musicInfo: AnyListen.Music.MusicInfo
  selectedList: AnyListen.Music.MusicInfo[]
  onRemoveAllSelected: () => void
}

export interface ListInfo {
  id: string
  name: string
  pic?: string
  desc?: string
  playCount?: number
  createTime?: string
  picIcon?: string
  saveable?: boolean
  listMeta?: {
    extensionId: string
    source: string
    [key: string]: unknown
  }
  getSortTimeFn?: () => ((list: AnyListen.Music.MusicInfo[], type: AnyListen.List.SortFileType) => Promise<string[]>) | null
}

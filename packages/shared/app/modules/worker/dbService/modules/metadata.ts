import { arrPush } from '@any-listen/common/utils'
import { getDB } from '../db'

/**
 * 获取播放统计
 * @returns 播放统计
 */
export const queryMetadataPlayCount = () => {
  const db = getDB()
  const result = db
    .prepare(
      `
    SELECT "field_name", "field_value"
    FROM "main"."metadata"
    WHERE "field_name"='play_count' OR "field_name"='play_time'
  `
    )
    .all() as [{ field_name: 'play_count'; field_value: string }, { field_name: 'play_time'; field_value: string }]
  const info = { count: 0, time: 0 }
  for (const { field_name, field_value } of result) {
    if (field_name == 'play_count') info.count = parseInt(field_value)
    else if (field_name == 'play_time') info.time = parseInt(field_value)
  }
  console.log(info)
  return info
}
/**
 * 更新播放次数
 */
export const updateMetadataPlayCount = (count?: number) => {
  const db = getDB()
  count ??=
    parseInt(
      (
        (db
          .prepare(
            `
      SELECT "field_value"
      FROM "main"."metadata"
      WHERE "field_name"='play_count'
    `
          )
          .get() as { field_value: string } | null) ?? { field_value: '0' }
      ).field_value
    ) + 1
  db.prepare<[string]>(
    `
    UPDATE "main"."metadata"
    SET "field_value"=?
    WHERE "field_name"='play_count'
  `
  ).run(String(count))
}
/**
 * 更新播放时长
 */
export const updateMetadataPlayTime = (time: number, isAdd = true) => {
  const db = getDB()
  if (isAdd) {
    time =
      parseInt(
        (
          (db
            .prepare(
              `
      SELECT "field_value"
      FROM "main"."metadata"
      WHERE "field_name"='play_time'
    `
            )
            .get() as { field_value: string } | null) ?? { field_value: '0' }
        ).field_value
      ) + time
  }
  db.prepare<[string]>(
    `
    UPDATE "main"."metadata"
    SET "field_value"=?
    WHERE "field_name"='play_time'
  `
  ).run(String(time))
}

interface PlayListInfo {
  listId: null | string
  isOnline: boolean
}
let playListInfo: PlayListInfo
const initPlayListInfo = () => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (playListInfo !== undefined) return
  const db = getDB()
  const result = db
    .prepare(
      `
    SELECT "field_value"
    FROM "main"."metadata"
    WHERE "field_name"='play_list_id'
  `
    )
    .get() as { field_value: string } | null
  const data = result?.field_value
  if (data) {
    try {
      const result = JSON.parse(data) as PlayListInfo
      playListInfo = result
      return
    } catch {}
  }
  playListInfo = {
    listId: null,
    isOnline: false,
  }
}
/**
 * 获取播放列表id
 */
export const queryMetadataPlayListInfo = () => {
  initPlayListInfo()
  return playListInfo
}
/**
 * 保存播放列表id
 * @param id
 */
export const saveMetadataPlayListInfo = (id: string | null, isOnline: boolean) => {
  if (playListInfo.listId == id) return
  playListInfo.listId = id
  playListInfo.isOnline = isOnline
  const db = getDB()
  db.prepare<[string | null]>(
    `
    INSERT INTO "main"."metadata" ("field_name", "field_value")
    VALUES ('play_list_id', ?)
  `
  ).run(JSON.stringify(playListInfo))
}

let playHistoryList: AnyListen.IPCPlayer.PlayHistoryListItem[]
const initPlayHistoryList = () => {
  if (playHistoryList) return
  const db = getDB()
  const result = db
    .prepare(
      `
    SELECT "field_value"
    FROM "main"."metadata"
    WHERE "field_name"='play_history_list'
  `
    )
    .get() as { field_value: string }
  if (!result) {
    db.prepare(
      `
      INSERT INTO "main"."metadata" ("field_name", "field_value")
      VALUES ('play_history_list', '[]')
    `
    ).run()
    playHistoryList = []
    return
  }
  try {
    playHistoryList = JSON.parse(result.field_value) ?? []
  } catch (e) {
    playHistoryList = []
  }
}
const savePlayHistoryList = () => {
  const db = getDB()
  db.prepare<[string]>(
    `
    UPDATE "main"."metadata"
    SET "field_value"=?
    WHERE "field_name"='play_history_list'
  `
  ).run(JSON.stringify(playHistoryList))
}
/**
 * 获取播放历史列表
 */
export const queryMetadataPlayHistoryList = () => {
  initPlayHistoryList()
  return playHistoryList
}

/**
 * 覆盖播放历史列表
 */
export const setMetadataPlayHistoryList = (ids: AnyListen.IPCPlayer.PlayHistoryListItem[]) => {
  initPlayHistoryList()
  if (!playHistoryList.length && !ids.length) return
  playHistoryList = ids
  savePlayHistoryList()
}

/**
 * 添加播放历史列表
 */
export const addMetadataPlayHistoryList = (ids: AnyListen.IPCPlayer.PlayHistoryListItem[]) => {
  initPlayHistoryList()
  arrPush(playHistoryList, ids)
  savePlayHistoryList()
}

/**
 * 添加播放历史列表
 */
export const removeMetadataPlayHistoryList = (idxs: number[]) => {
  initPlayHistoryList()
  idxs.sort((a, b) => b - a)
  for (const idx of idxs) playHistoryList.splice(idx, 1)
  savePlayHistoryList()
}

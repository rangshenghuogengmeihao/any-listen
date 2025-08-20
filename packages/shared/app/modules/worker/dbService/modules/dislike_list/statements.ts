import { dbPrepare } from '../../db'

export interface DislikeInfo {
  // type: 'music'
  content: string
  // meta: string | null
}

/**
 * 创建不喜欢列表查询语句
 * @returns 查询语句
 */
export const createQueryStatement = () => {
  return dbPrepare<[], DislikeInfo>(`
    SELECT "content"
    FROM dislike_list
    WHERE "type"='music'
  `)
}

/**
 * 创建不喜欢记录插入语句
 * @returns 插入语句
 */
export const createInsertStatement = () => {
  return dbPrepare<DislikeInfo>(`
    INSERT INTO "main"."dislike_list" ("type", "content")
    VALUES ('music', @content)`)
}

/**
 * 创建不喜欢记录清空语句
 * @returns 清空语句
 */
export const createClearStatement = () => {
  return dbPrepare(`
    DELETE FROM "main"."dislike_list"
  `)
}

// /**
//  * 创建不喜欢记录删除语句
//  * @returns 删除语句
//  */
// export const createDeleteStatement = () => {
//   return dbPrepare<bigint>(`
//     DELETE FROM "main"."dislike_list"
//     WHERE "id"=?
//   `)
// }

// /**
//  * 创建不喜欢记录更新语句
//  * @returns 更新语句
//  */
// export const createUpdateStatement = () => {
//   return dbPrepare<DislikeInfo>(`
//     UPDATE "main"."dislike_list"
//     SET "name"=@name, "singer"=@singer
//     WHERE "id"=@id
//   `)
// }

import { request } from '@any-listen/nodejs/request'

const API_URL = 'https://raw.githubusercontent.com/any-listen/any-listen-extension-store/main'

let datas = {
  tags: null as AnyListen.IPCExtension.OnlineTagResult | null,
  categories: null as AnyListen.IPCExtension.OnlineCategorieResult | null,
  list: null as AnyListen.IPCExtension.OnlineListItem[] | null,
}

export const getTags = async (): Promise<AnyListen.IPCExtension.OnlineTagResult> => {
  if (!datas.tags) {
    const { body } = await request<AnyListen.IPCExtension.OnlineTagResult | null>(`${API_URL}/tags.json`)

    if (!body || !Array.isArray(body)) throw new Error('Invalid tags data')
    if (body.length) {
      if (typeof body[0]?.id != 'string' || typeof body[0]?.name != 'string') throw new Error('Invalid tags data')
    }
    datas.tags = body
  }
  return datas.tags
}

export const getCategories = async (): Promise<AnyListen.IPCExtension.OnlineCategorieResult> => {
  if (!datas.categories) {
    const { body } = await request<AnyListen.IPCExtension.OnlineCategorieResult | null>(`${API_URL}/categories.json`)

    if (!body || !Array.isArray(body)) throw new Error('Invalid categories data')
    if (body.length) {
      if (typeof body[0]?.id != 'string' || typeof body[0]?.name != 'string') throw new Error('Invalid categories data')
    }
    datas.categories = body
  }
  return datas.categories
}

const getList = async (): Promise<AnyListen.IPCExtension.OnlineListItem[]> => {
  if (!datas.list) {
    const { body } = await request<{ all: AnyListen.IPCExtension.OnlineListItem[] } | null>(`${API_URL}/list.json`)

    if (!body || !Array.isArray(body.all)) throw new Error('Invalid list data')
    if (body.all.length) {
      if (typeof body.all[0]?.id != 'string' || typeof body.all[0]?.name != 'string') throw new Error('Invalid list data')
    }
    datas.list = body.all
  }
  return datas.list
}

export const getOnlineExtensionList = async (
  filter: AnyListen.IPCExtension.OnlineListFilterOptions
): Promise<AnyListen.IPCExtension.OnlineListResult> => {
  const list = await getList()

  return {
    total: list.length,
    page: filter.page,
    limit: filter.limit,
    list: list.slice((filter.page - 1) * filter.limit, filter.page * filter.limit),
  }
}

import { ipc } from '../ipc'

/** 获取主题配置 */
export const getThemeSetting = async () => {
  return ipc.getThemeSetting()
}
/** 获取主题列表 */
export const getThemeList = async () => {
  return ipc.getThemeList()
}
/** 保存主题 */
export const saveTheme = async (theme: AnyListen.Theme) => {
  return ipc.saveTheme(theme)
}
/** 移除主题 */
export const removeTheme = async (id: string) => {
  return ipc.removeTheme(id)
}

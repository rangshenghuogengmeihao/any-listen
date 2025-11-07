import { setShowPlayDetail } from '@/modules/playDetail/store/commit'
import { createClickHandle } from '@any-listen/web'

export const hidePlayDtail = (dom: HTMLElement) => {
  const handleClick = createClickHandle(
    () => {},
    () => {
      setShowPlayDetail(false)
    }
  )
  const handleCtxMenu = () => {
    handleClick()
  }

  dom.addEventListener('contextmenu', handleCtxMenu)

  return () => {
    dom.removeEventListener('contextmenu', handleCtxMenu)
  }
}

import { setShowPlayDetail } from '@/modules/playDetail/store/commit'
import { createClickHandle } from '@any-listen/web'
import type { Action } from 'svelte/action'

export const hidePlayDtail: Action = (dom) => {
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

  return {
    destroy() {
      dom.removeEventListener('contextmenu', handleCtxMenu)
    },
  }
}

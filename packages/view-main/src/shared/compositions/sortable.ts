import { appEvent } from '@/modules/app/store/event'
import Sortable, { AutoScroll } from 'sortablejs'
import type { Action } from 'svelte/action'

Sortable.mount(new AutoScroll())

export type OnUpdate = (
  parentId: string | undefined,
  id: string | undefined,
  toTargetId: string | undefined,
  position: number
) => void

export const sortable: Action<HTMLElement, OnUpdate | undefined> = (dom: HTMLElement, onupdate) => {
  if (!onupdate) return
  console.log(dom)
  let sortable: Sortable | null = Sortable.create(dom, {
    animation: 150,
    disabled: true,
    // forceFallback: false,
    // group: 'nested',
    // fallbackOnBody: true,
    // swapThreshold: 0.65,
    draggable: '.draggable-item',
    dragClass: '.draggable-item',
    onStart() {
      appEvent.drag(false)
    },
    onEnd(event) {
      appEvent.drag(true)
      console.log(event)
      const parentId = event.from.dataset.id
      const toId = event.to.dataset.id
      const id = event.item.dataset.id
      const oldIndex = event.oldIndex
      const newIndex = event.newIndex
      if ((parentId == toId && oldIndex == newIndex) || newIndex == null) return
      if (event.to !== event.from) {
        event.to.removeChild(event.item)
        event.from.appendChild(event.item)
      }
      queueMicrotask(() => {
        console.log(parentId, id, toId, newIndex)
        onupdate(parentId, id, toId, newIndex)
      })
    },
  })

  const keydownEvent = (evt: KeyboardEvent) => {
    if (evt.key != 'Control' || evt.repeat) return
    sortable!.option('disabled', false)
    console.log('sortable enabled')
  }
  const keyupEvent = (evt: KeyboardEvent) => {
    if (evt.key != 'Control' || evt.repeat) return
    sortable!.option('disabled', true)
  }

  window.addEventListener('keydown', keydownEvent)
  window.addEventListener('keyup', keyupEvent)

  return {
    // async update(onupdate) {
    // //   if (visible != show) {
    // //     await tick()
    // //     if (visible) handleShow(location)
    // //     else handleHide()
    // //   } else {
    // //     dom.style.left = `${location.x - appState.rootOffset + 2}px`
    // //     dom.style.top = `${location.y - appState.rootOffset}px`
    // //     if (show) {
    // //       if (dom.style.transitionProperty != transition2) dom.style.transitionProperty = transition2
    // //       dom.style.transform = `scale(1) translate(${getOffsetXY(dom, location.x, location.y)})`
    // //     }
    // //   }
    // },
    destroy() {
      window.removeEventListener('keydown', keydownEvent)
      window.removeEventListener('keyup', keyupEvent)
      sortable?.destroy()
      sortable = null
    },
  }
}

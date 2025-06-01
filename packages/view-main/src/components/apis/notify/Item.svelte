<script lang="ts">
  import { fly } from 'svelte/transition'
  import { extensionList } from '@/modules/extension/reactive.svelte'
  import { extI18n } from '@/modules/extension/i18n'
  import type { NotifyItem } from './shared'
  import { onDestroy, onMount } from 'svelte'
  import { onSettingChanged } from '@/modules/setting/shared'
  import Btn from '@/components/base/Btn.svelte'
  import SvgIcon from '@/components/base/SvgIcon.svelte'

  let {
    item,
    offset = 0,
    onhide,
    onmount,
  }: {
    offset?: number
    item: NotifyItem
    onhide: () => void
    onmount: (height: number) => void
  } = $props()

  let autoCloseTimer: number | null = null
  let domContent = $state<HTMLDivElement | null>(null)
  let extensionName = $derived.by(() => {
    if (!item.extId) return ''
    const ext = $extensionList.find((ext) => ext.id === item.extId)
    return ext ? extI18n.t(item.extId, ext.name) : ''
  })
  let transform = $derived(`translateX(-50%) translateY(${-offset}px)`)

  let hideTime = 0
  const addAutoCloseTimer = () => {
    clearAutoCloseTimer()
    autoCloseTimer = setTimeout(
      () => {
        autoCloseTimer = null
        onhide()
      },
      hideTime == 0 ? item.autoCloseTime * 1000 : hideTime
    )
  }
  const clearAutoCloseTimer = () => {
    if (!autoCloseTimer) return
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
    hideTime = 0
  }

  $effect(() => {
    const unsub = onSettingChanged('common.windowSizeId', () => {
      onmount(domContent?.clientHeight ?? 0)
    })
    return () => {
      unsub()
    }
  })
  onMount(() => {
    addAutoCloseTimer()
    hideTime = performance.now() + item.autoCloseTime * 1000
    onmount(domContent?.clientHeight ?? 0)
  })
  onDestroy(() => {
    clearAutoCloseTimer()
  })
</script>

<div
  class="notify-content"
  role="alert"
  bind:this={domContent}
  style:transform
  transition:fly|global={{ y: 30 }}
  onoutroend={item.onafterleave}
  onmouseenter={() => {
    hideTime = Math.max(2000, hideTime - performance.now())
    clearAutoCloseTimer()
  }}
  onmouseleave={() => {
    addAutoCloseTimer()
  }}
>
  <div class="content" class:select={item.selectText}>
    {#if extensionName}
      <span>[{extensionName}]</span>
    {/if}{item.message}
  </div>
  <Btn
    icon
    min
    link
    onclick={() => {
      clearAutoCloseTimer()
      onhide()
    }}
  >
    <SvgIcon name="multiply" />
  </Btn>
</div>

<style lang="less">
  .notify-content {
    position: absolute;
    max-width: 100%;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    // transform: scale(1);
    line-height: 1.2;
    word-wrap: break-word;
    font-size: 14px;
    color: var(--color-font);
    padding: 8px 8px 8px 14px;
    border-radius: @radius-border;
    background: var(--color-content-background);
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    white-space: pre-wrap;
    box-sizing: border-box;
    overflow: hidden;
    transition: transform @transition-normal;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
    min-width: 100px;

    .content {
      flex: auto;
      min-width: 0;
    }

    .select {
      user-select: text;
    }

    :global(.btn) {
      opacity: 0.4;
      &:hover {
        opacity: 1;
      }
    }

    span {
      font-size: 12px;
      color: var(--color-primary-dark-500-alpha-300);
      margin-right: 5px;
    }
  }

  // :global(.tips-fade-enter-active),
  // :global(.tips-fade-leave-active) {
  //   transition: opacity 0.2s;
  // }
  // :global(.tips-fade-enter),
  // :global(.tips-fade-leave-to) {
  //   opacity: 0;
  // }
</style>

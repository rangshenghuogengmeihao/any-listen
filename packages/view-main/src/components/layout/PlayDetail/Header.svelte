<script lang="ts">
  import { windowDarg } from '@/shared/browser/widnow'
  import { t } from '@/plugins/i18n'
  import { setShowPlayDetail } from '@/modules/playDetail/store/commit'
  import { onMount } from 'svelte'
  import { appEvent } from '@/modules/app/store/event'

  let domBtns = $state<HTMLDivElement>()

  let isFullscreen = false

  onMount(() => {
    const getBtnEl = (el: HTMLElement | null): HTMLButtonElement | null => {
      return el ? (el.tagName == 'BUTTON' ? (el as HTMLButtonElement) : getBtnEl(el.parentNode as HTMLElement | null)) : null
    }
    const handleMouseover = (event: MouseEvent) => {
      const btn = getBtnEl(event.target as HTMLElement)
      if (!btn) return
      btn.classList.add('hover')
    }
    const handleMouseout = (event: MouseEvent) => {
      const btn = getBtnEl(event.target as HTMLElement)
      if (!btn) return
      btn.classList.remove('hover')
    }

    const unsub = appEvent.on('focus', () => {
      if (!domBtns) return
      for (const node of domBtns.childNodes) {
        if ((node as HTMLElement).tagName != 'BUTTON') continue
        ;(node as HTMLElement).classList.remove('hover')
      }
    })
    domBtns!.addEventListener('mouseover', handleMouseover)
    domBtns!.addEventListener('mouseout', handleMouseout)
    return () => {
      unsub()
      domBtns!.removeEventListener('mouseover', handleMouseover)
      domBtns!.removeEventListener('mouseout', handleMouseout)
    }
  })
</script>

{#snippet content()}
  <div bind:this={domBtns} class="controBtn">
    <button
      type="button"
      class="hide"
      data-ignore-tip
      aria-label={$t('play_detail.hide_tip')}
      title={$t('play_detail.hide_tip')}
      onclick={() => {
        setShowPlayDetail(false)
      }}
    >
      <svg version="1.1" height="35%" viewBox="0 0 30.727 30.727">
        <use xlink:href="#icon-window-hide" />
      </svg>
    </button>
  </div>
{/snippet}

{#if import.meta.env.VITE_IS_DESKTOP}
  <div class="header" class:fullscreen={isFullscreen}>
    {@render content()}
  </div>
{/if}
{#if import.meta.env.VITE_IS_WEB}
  <div class="header" class:fullscreen={isFullscreen} use:windowDarg>
    {@render content()}
  </div>
{/if}

<style lang="less">
  :global(.fullscreen) {
    .header {
      -webkit-app-region: no-drag;
      align-self: flex-start;
      // .controBtn {
      //   .close,
      //   .min {
      //     display: none;
      //   }
      //   .fullscreenExit {
      //     display: flex;
      //   }
      // }
    }
  }
  .header {
    flex: none;
    position: relative;
    flex: 0 0 @height-toolbar;
    -webkit-app-region: drag;
    width: 100%;
    align-self: flex-start;

    .controBtn {
      position: absolute;
      top: 0;
      display: flex;
      -webkit-app-region: no-drag;

      button {
        display: flex;
        position: relative;
        background: none;
        border: none;
        outline: none;
        padding: 1px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      // .fullscreenExit {
      //   display: none;
      // }
    }

    .controBtn {
      right: 0;
      button {
        width: 46px;
        height: 30px;
        color: var(--color-font-label);
        transition: background-color 0.2s ease-in-out;

        &:global(.hover) {
          background-color: var(--color-button-background-hover);

          &.close {
            background-color: var(--color-btn-close);
          }
        }
      }
    }
  }
</style>

<script lang="ts">
  import { isShowPlayDetail } from '@/modules/playDetail/reactive.svelte'
  import { fly } from 'svelte/transition'
  import Header from './Header.svelte'
  import Main from './Main.svelte'
  import { hidePlayDtail } from './shared/hidePlayDtail'
  import Footer from './Footer/index.svelte'
  import { playDetailState } from '@/modules/playDetail/store/state'
  import { playerEvent } from '@/modules/player/store/event'
  import { playerState } from '@/modules/player/store/state'
  import { useSettingValue } from '@/modules/setting/reactive.svelte'
  let introend = $state(playDetailState.isShowPlayDetail)
  let bgSrc = $state<string>()
  const isDynamicBackground = useSettingValue('playDetail.isDynamicBackground')

  $effect(() => {
    if (!isDynamicBackground.val) {
      bgSrc = undefined
      return
    }
    const handlePic = (url?: string | null) => {
      if (url) {
        const img = new Image()
        img.onload = () => {
          bgSrc = `url(${url})`
        }
        img.onerror = () => {
          bgSrc = undefined
        }
        img.src = url
      } else {
        bgSrc = undefined
      }
    }
    handlePic(playerState.musicInfo.pic)
    return playerEvent.on('picUpdated', handlePic)
  })
</script>

{#if $isShowPlayDetail}
  <div
    in:fly={{ x: '100%', opacity: 1, delay: 10 }}
    out:fly={{ y: '100%', opacity: 1, delay: 10 }}
    class="play-detail"
    class:dybg={bgSrc}
    use:hidePlayDtail
    onintroend={() => {
      introend = true
    }}
    onoutroend={() => {
      introend = false
    }}
  >
    <div class="bg" style:background-image={bgSrc}></div>
    <Header />
    <Main {introend} />
    <Footer {introend} />
  </div>
{/if}

<style lang="less">
  .play-detail {
    position: absolute;
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: var(--color-content-background);
    z-index: 10;
    // -webkit-app-region: drag;
    // overflow: hidden;
    border-radius: @radius-border;
    color: var(--color-font);
    // border-left: 12px solid var(--color-primary-alpha-900);
    -webkit-app-region: no-drag;
    contain: strict;
    // will-change: transform;

    &.dybg {
      :global {
        * {
          text-shadow:
            0 0 2px var(--color-primary-light-100-alpha-900),
            0 0 3px var(--color-primary-light-100-alpha-900),
            0 0 4px var(--color-primary-dark-700-alpha-900);
        }
        svg {
          filter: drop-shadow(0 0 2px var(--color-primary-light-100-alpha-600))
            drop-shadow(0 0 4px var(--color-primary-light-100-alpha-700));
        }
        .progress {
          > .progress {
            box-shadow:
              0 0 2px var(--color-primary-light-200-alpha-800),
              0 0 4px var(--color-primary-light-200-alpha-800);
          }
        }
      }
      .bg {
        background-size: 125% 125%;
        &:before {
          background-color: var(--color-content-background);
          opacity: 0.7;
        }
        &:after {
          background-color: transparent;
          backdrop-filter: blur(30px);
        }
      }
    }
  }
  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: var(--background-image) var(--background-image-position) no-repeat;
    background-size: var(--background-image-size);
    // background-size: 110% 110%;
    // filter: blur(60px);
    opacity: 0.7;
    z-index: -1;
    &:before {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      background-color: var(--color-app-background);
    }
    &:after {
      position: absolute;
      left: 0;
      top: 0;
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      background-color: var(--color-main-background);
    }
  }
</style>

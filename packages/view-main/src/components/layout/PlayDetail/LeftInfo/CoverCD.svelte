<script lang="ts">
  import Image from '@/components/base/Image.svelte'
  import { musicInfo, playerPlaying } from '@/modules/player/reactive.svelte'
  import { onVisibilityChange } from '@any-listen/web'
  import { onMount } from 'svelte'

  // let { introend }: { introend: boolean } = $props()

  let pic = $derived($musicInfo.pic)
  let visible = $state(true)

  onMount(() => {
    return onVisibilityChange((hidden) => {
      visible = !hidden
    })
  })
</script>

<div class="cover">
  <span class="top-dot"></span>
  <span class="bottom-dot"></span>
  <div class="cover-cd" class:playing={$playerPlaying && visible}>
    <Image src={pic} />
    <div class="cover-cd-center"></div>
    <div class="cover-cd-center-border"></div>
  </div>
  <!-- <div class="cover-cd-decorate"></div> -->
</div>

<style lang="less">
  .cover {
    position: relative;
    flex: none;
    width: var(--content-width);
    aspect-ratio: 1 / 1;
    padding: 5%;
    contain: strict;
    background-color: var(--color-primary-light-300-alpha-800);
    border-radius: 6px;
    box-shadow: 0 0 6px var(--color-primary-alpha-500);
    // box-shadow: 0 0 6px var(--color-primary-alpha-500);
    // border-radius: 6px;
    opacity: 0.8;
    backdrop-filter: blur(4px);

    .mixin-dot(@color: var(--color-primary-light-300-alpha-800)) {
      .mixin-after();

      width: 7%;
      aspect-ratio: 1 / 1;
      background-color: @color;
      border-radius: 50%;
      box-shadow: inset 0 0 4px var(--color-primary-dark-300-alpha-800);
    }

    .top-dot {
      &::before {
        top: 5%;
        left: 5%;
        .mixin-dot();
      }
      &::after {
        top: 5%;
        right: 5%;
        .mixin-dot();
      }
    }
    .bottom-dot {
      &::before {
        bottom: 5%;
        left: 5%;
        .mixin-dot();
      }
      &::after {
        right: 5%;
        bottom: 5%;
        .mixin-dot();
      }
    }
  }
  .cover-cd {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 6px;
    contain: strict;
    overflow: hidden;
    background: radial-gradient(circle, transparent 0%, transparent 15%, var(--color-primary-light-100) 15%);
    border-radius: 50%;
    box-shadow: 0 0 6px var(--color-primary-alpha-200);
    // border: 6px solid var(--color-primary-light-100);
    animation: spin 120s linear infinite;
    animation-play-state: paused; /* 默认暂停 */
    &.playing {
      animation-play-state: running;
    }

    :global {
      .pic {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        mask-image: radial-gradient(circle, transparent 0%, transparent 16%, black 16%);

        &.empty-pic {
          background-color: var(--color-primary-light-300-alpha-700);
        }
      }
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .cover-cd-center {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40%;
    aspect-ratio: 1 / 1;
    background-color: var(--color-primary-alpha-800);
    // border: 2px solid var(--color-primary-dark-200-alpha-900);
    border-radius: 50%;
    mask-image: radial-gradient(circle, transparent 0%, transparent 37%, black 37%);
    transform: translate(-50%, -50%);
  }
  .cover-cd-center-border {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 23%;
    aspect-ratio: 1 / 1;
    border: 4px solid var(--color-primary-light-100);
    border-radius: 50%;
    box-shadow: inset 0 0 4px var(--color-primary-dark-900);
    transform: translate(-50%, -50%);
  }

  // .cover-cd-decorate {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100%;
  //   z-index: -1;
  // }
</style>

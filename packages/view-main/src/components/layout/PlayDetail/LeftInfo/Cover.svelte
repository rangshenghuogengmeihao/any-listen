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
  </div>
  <!-- <div class="cover-cd-decorate"></div> -->
</div>

<style lang="less">
  .cover {
    flex: none;
    position: relative;
    width: var(--content-with);
    // box-shadow: 0 0 6px var(--color-primary-alpha-500);
    // border-radius: 6px;
    opacity: 0.8;
    padding: 5%;
    backdrop-filter: blur(4px);
    border-radius: 6px;
    box-shadow: 0 0 6px var(--color-primary-alpha-500);
    contain: strict;
    background-color: var(--color-primary-light-300-alpha-800);
    aspect-ratio: 1 / 1;

    .mixin-dot(@color: var(--color-primary-light-300-alpha-800)) {
      .mixin-after();
      width: 8%;
      aspect-ratio: 1 / 1;
      border-radius: 50%;
      background-color: @color;
      box-shadow: inset 0 0 4px var(--color-primary-dark-300-alpha-800);
    }

    .top-dot {
      &::before {
        left: 5%;
        top: 5%;
        .mixin-dot();
      }
      &::after {
        right: 5%;
        top: 5%;
        .mixin-dot(var(--color-primary-light-300-alpha-600));
      }
    }
    .bottom-dot {
      &::before {
        left: 5%;
        bottom: 5%;
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
    contain: strict;
    border-radius: 50%;
    overflow: hidden;
    padding: 6px;
    background: radial-gradient(circle, transparent 0%, transparent 15%, var(--color-primary-light-100) 15%);
    box-shadow: 0 0 8px var(--color-primary-alpha-200);
    // border: 6px solid var(--color-primary-light-100);
    animation: spin 90s linear infinite;
    animation-play-state: paused; /* 默认暂停 */
    &.playing {
      animation-play-state: running;
    }

    :global(.pic) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      mask-image: radial-gradient(circle, transparent 0%, transparent 16%, black 16%);
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
    transform: translate(-50%, -50%);
    border-radius: 50%;
    width: 22%;
    aspect-ratio: 1 / 1;
    // background-color: var(--color-primary-alpha-500);

    box-shadow: inset 0 0 4px var(--color-primary-dark-900);
    border: 4px solid var(--color-primary-light-100);
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

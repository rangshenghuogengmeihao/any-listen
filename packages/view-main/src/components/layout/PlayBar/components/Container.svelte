<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    children,
  }: {
    children: Snippet
  } = $props()
</script>

<div class="player">
  <div class="bg"></div>
  <div class="player-inner">
    {@render children()}
  </div>
</div>

<style lang="less">
  .player {
    position: relative;
    height: @height-player;
    // border-top: 3px solid var(--color-border);
    // display: flex;
    // flex-flow: row nowrap;
    // align-items: center;
    contain: size layout style;
    // padding: 6px;
    z-index: 2;
    // box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
    // border-top-left-radius: 8px;
    // border-top-right-radius: 8px;
    // backdrop-filter: blur(4px);
    // * {
    //   box-sizing: border-box;
    // }

    // &:before {
    //   .mixin-after();
    //   left: 0;
    //   top: 0;
    //   width: 100%;
    //   height: 100%;
    //   box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
    //   border-top-left-radius: 8px;
    //   border-top-right-radius: 8px;
    //   // background-color: var(--color-main-background);
    //   // opacity: 0.9;
    //   z-index: -1;
    //   backdrop-filter: blur(4px);
    //   transition: @transition-normal;
    //   transition-property: opacity;
    // }
  }
  .bg {
    width: 100%;
    height: 100%;
    box-shadow: 0 0 6px var(--color-primary-dark-200-alpha-800);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    // border-top: 1px solid var(--color-primary-light-300-alpha-800);
    // z-index: -1;
    backdrop-filter: blur(4px);
    transition: @transition-normal;
    transition-property: opacity;
    opacity: 0.8;
  }
  .player-inner {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    padding-right: 10px;
    contain: strict;
    transition: @transition-normal;
    transition-property: opacity;
  }
</style>

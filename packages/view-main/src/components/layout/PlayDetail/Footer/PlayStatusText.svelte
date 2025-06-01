<script lang="ts">
  import { playerPlaying, statusText } from '@/modules/player/reactive.svelte'
  let status = $derived($playerPlaying ? '' : $statusText)
</script>

<div class="play-status">
  {status}
</div>

<style lang="less">
  .play-status {
    position: absolute;
    bottom: 3px;
    left: 0;
    width: 100%;
    text-align: center;
    box-sizing: content-box;
    height: 16px;
    font-size: 12px;
    .mixin-ellipsis-1();
    pointer-events: none;
    color: var(--color-font-label);
  }
</style>

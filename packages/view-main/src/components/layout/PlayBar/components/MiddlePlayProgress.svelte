<script lang="ts">
  import PlayerProgressBar from '@/components/common/PlayerProgressBar.svelte'
  import { duration, progress } from '@/modules/player/reactive.svelte'
</script>

<div class="middle-play-progress">
  <span>{$progress.nowPlayTimeStr}</span>
  <div class="progress">
    <PlayerProgressBar />
  </div>
  <!-- <span style="margin: 0 1px;">/</span> -->
  <span>{$duration.label}</span>
</div>

<style lang="less">
  .middle-play-progress {
    width: 30%;
    // position: relative;
    flex: none;
    color: var(--color-550);
    font-size: 13px;
    // padding-left: 10px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }
  .progress {
    // position: absolute;
    // top: 0;
    // left: 0;
    // width: 100%;
    flex: auto;
    // width: 160px;
    position: relative;
    // padding-bottom: 6px;
    margin: 0 8px;
    padding: 8px 0;
    // height: 15px;
    // .progressBar {
    //   height: 4px;
    //   // border-radius: 0;
    // }
  }
</style>

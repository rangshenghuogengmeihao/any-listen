<script lang="ts">
  import LeftInfo from './LeftInfo/index.svelte'
  import RightLyric from './RightLyric/index.svelte'

  let { introend }: { introend: boolean } = $props()
</script>

<div class="player-detail-main">
  <LeftInfo />
  <RightLyric {introend} />
</div>

<style lang="less">
  .player-detail-main {
    flex: auto;
    min-height: 0;
    overflow: hidden;
    display: flex;
    // margin: 0 20px;
    position: relative;
  }
</style>

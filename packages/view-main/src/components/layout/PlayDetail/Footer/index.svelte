<script lang="ts">
  import RightControlBtns from './RightControlBtns.svelte'
  import LeftControlBtns from './LeftControlBtns.svelte'
  import MiddlePlayProgress from './MiddlePlayProgress.svelte'
  import PlayBtns from './PlayBtns.svelte'
  import PlayStatusText from './PlayStatusText.svelte'
  import { fade } from 'svelte/transition'

  let { introend }: { introend: boolean } = $props()
</script>

<div class="footer">
  {#if introend}
    <div in:fade={{ delay: 5 }} class="footer-content">
      <div class="control">
        <div class="side">
          <LeftControlBtns />
        </div>
        <PlayBtns />
        <div class="side right">
          <RightControlBtns />
        </div>
      </div>
      <MiddlePlayProgress />
      <PlayStatusText />
    </div>
  {/if}
</div>

<style lang="less">
  .footer {
    flex: none;
    height: 100px;
    contain: strict;
  }
  .footer-content {
    height: 100%;
    position: relative;
    display: flex;
    flex-flow: column nowrap;
    padding: 0 30px 16px 30px;
    > :global(.middle-play-progress) {
      flex: none;
      width: 100%;
    }
  }
  .control {
    display: flex;
    flex-flow: row nowrap;
    flex: auto;
  }

  .side {
    height: 100%;
    flex: 1;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    position: relative;
    padding-top: 15px;
  }

  .right {
    justify-content: flex-end;
    padding-left: 16px;
    margin-left: -10px;
  }
</style>

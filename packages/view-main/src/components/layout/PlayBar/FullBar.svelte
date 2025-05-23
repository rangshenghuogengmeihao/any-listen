<script>
  import Container from './components/Container.svelte'
  import PlayInfo from './components/PlayInfo.svelte'
  import Pic from './components/Pic.svelte'
  import PlayBtns from './components/PlayBtns.svelte'
  import ControlBtns from './components/ControlBtns.svelte'
  import Times from './components/Times.svelte'
  import PlayerProgressBar from '@/components/common/PlayerProgressBar.svelte'
  // export let params = {}

  // console.log(params)
</script>

<Container>
  <div class="progress">
    <PlayerProgressBar />
  </div>
  <Pic />
  <PlayInfo />
  <Times />
  <ControlBtns />
  <PlayBtns />
</Container>

<style lang="less">
  .progress {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding-bottom: 6px;
    margin: 0 10px;
    box-sizing: border-box;
    // height: 15px;
    :global {
      .progress {
        height: 2px;
        border-radius: 0;
        background-color: var(--color-primary-light-100-alpha-900);
      }
      .progressBar2 {
        background-color: var(--color-primary-light-100-alpha-600);
      }
      .progressBar3 {
        background-color: var(--color-primary-light-100-alpha-400);
      }
    }
  }
</style>

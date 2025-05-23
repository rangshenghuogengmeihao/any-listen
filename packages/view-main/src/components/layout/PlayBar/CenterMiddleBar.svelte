<script>
  import Container from './components/Container.svelte'
  import PlayInfo from './components/PlayInfo.svelte'
  import Pic from './components/Pic.svelte'
  import PlayBtns from './components/PlayBtns.svelte'
  import ControlBtns from './components/ControlBtns.svelte'
  import MiddlePlayProgress from './components/MiddlePlayProgress.svelte'
  // export let params = {}

  // console.log(params)
</script>

<Container>
  <div class="side">
    <Pic />
    <PlayInfo />
  </div>
  <PlayBtns />
  <div class="side right">
    <div class="progress">
      <MiddlePlayProgress />
    </div>
    <ControlBtns />
  </div>
</Container>

<style lang="less">
  .side {
    height: 100%;
    flex: 1;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    position: relative;
  }

  .right {
    justify-content: flex-end;
    padding-left: 16px;
    margin-left: -10px;
  }

  .progress {
    flex: auto;
    display: flex;
    :global(> .content) {
      width: 100%;
    }
  }
</style>

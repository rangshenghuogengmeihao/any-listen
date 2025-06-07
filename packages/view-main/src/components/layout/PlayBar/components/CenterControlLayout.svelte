<script lang="ts">
  import Container from './Container.svelte'
  import PlayBtns from './PlayBtns.svelte'
  import type { Snippet } from 'svelte'
  let {
    left,
    right,
    children,
  }: {
    left: Snippet
    right: Snippet
    children?: Snippet
  } = $props()
</script>

<Container>
  {@render children?.()}
  <div class="side">
    {@render left()}
  </div>
  <PlayBtns />
  <div class="side right">
    {@render right()}
    <div class="space"></div>
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
    min-width: 0;
  }

  .right {
    justify-content: flex-end;
  }
  .space {
    padding-right: 10px;
  }
</style>

<script lang="ts">
  import Empty from '@/components/material/Empty.svelte'
  import { extensionList } from '@/modules/extension/reactive.svelte'
  import ListItem from './ListItem.svelte'
  import type { viewTypes } from './shared'
  import { verticalScrollbar } from '@/shared/compositions/verticalScrollbar'
  import ListItemEnpty from './ListItemEnpty.svelte'
  let { type }: { type: Omit<(typeof viewTypes)[number], 'online'> } = $props()
  let list = $derived(
    type == 'installed'
      ? $extensionList
      : type == 'enabled'
        ? $extensionList.filter((e) => e.enabled)
        : $extensionList.filter((e) => !e.enabled)
  )
</script>

<div class="container">
  {#if list.length}
    <ul class="list" use:verticalScrollbar={{ offset: '0.22rem' }}>
      {#each list as ext (ext.id)}
        <ListItem {ext} />
      {/each}
      <ListItemEnpty />
      <ListItemEnpty />
      <ListItemEnpty />
      <ListItemEnpty />
      <ListItemEnpty />
      <ListItemEnpty />
    </ul>
  {:else}
    <Empty />
  {/if}
</div>

<style lang="less">
  .container {
    position: relative;
    display: flex;
    flex: auto;
    flex-flow: column nowrap;
    min-height: 0;
    margin-top: 15px;
  }
  .list {
    display: flex;
    flex-flow: row wrap;
    gap: 16px;
    min-height: 0;
    padding: 0 16px 16px;
    overflow: hidden;
  }
</style>

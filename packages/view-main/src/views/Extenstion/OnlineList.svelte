<script lang="ts">
  import Empty from '@/components/material/Empty.svelte'
  import { useOnlineExtensionList } from '@/modules/extension/reactive.svelte'
  import { getOnlineExtensionList } from '@/modules/extension/store/actions'

  // import { extensionList } from '@/modules/extension/reactive'
  import ListItemOnline from './ListItemOnline.svelte'
  import ListItemEnpty from './ListItemEnpty.svelte'
  import { t } from '@/plugins/i18n'
  let loading = $state(false)

  const list = useOnlineExtensionList()

  $effect(() => {
    loading = true
    void getOnlineExtensionList().finally(() => {
      loading = false
    })
  })
</script>

<div class="container">
  {#if list.val.length}
    <ul class="list">
      {#each list.val as ext (ext.id)}
        <ListItemOnline {ext} />
      {/each}
      <ListItemEnpty />
      <ListItemEnpty />
      <ListItemEnpty />
      <ListItemEnpty />
      <ListItemEnpty />
      <ListItemEnpty />
    </ul>
  {:else}
    <Empty label={loading ? $t('loading') : ''} />
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

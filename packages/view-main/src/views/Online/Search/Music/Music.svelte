<script lang="ts">
  import type { ResourceListType } from '../../shared'
  import { getSourceId } from '../shared'
  import Source from '../Source.svelte'
  import { query, replace } from '@/plugins/routes'
  import List from './List.svelte'

  let { sourceList }: { sourceList: NonNullable<ResourceListType['musicSearch']> } = $props()
  let list = $derived(sourceList.map((s) => ({ ...s, sId: getSourceId(s) })))
  let activeSource = $derived($query.source ? list.find((s) => s.sId == $query.source) : list[0])
</script>

<div class="online-search-music">
  {#if list.length}
    <Source
      {list}
      active={activeSource?.sId}
      onchange={(source) => {
        void replace('/online', {
          type: $query.type,
          searchType: $query.searchType,
          source: source.sId,
          text: $query.text,
          page: 1,
        })
      }}
    />
  {/if}
  {#if activeSource}
    <List source={activeSource} />
  {/if}
</div>

<style lang="less">
  .online-search-music {
    display: flex;
    flex-flow: row nowrap;
    height: 100%;
    padding-top: 10px;
  }
</style>

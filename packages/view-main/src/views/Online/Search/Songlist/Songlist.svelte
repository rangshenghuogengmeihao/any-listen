<script lang="ts">
  import { getSourceId, urlParamKeyMap, type ResourceListType, type SourceType, type ViewType } from '../../shared.svelte'
  import Source from '../../Source.svelte'
  import { query, replace } from '@/plugins/routes'
  import List from './List.svelte'
  import { SvelteURLSearchParams } from 'svelte/reactivity'
  import { untrack } from 'svelte'

  let { sourceList }: { sourceList: NonNullable<ResourceListType['songlistSearch']> } = $props()
  let list = $derived(sourceList.map((s) => ({ ...s, sId: getSourceId(s) })))
  let activeSource = $derived(
    $query[urlParamKeyMap.source] ? list.find((s) => s.sId == $query[urlParamKeyMap.source]) : undefined
  )

  const to = (source: SourceType) => {
    const params = new SvelteURLSearchParams()
    params.set(urlParamKeyMap.type, 'search' satisfies ViewType)
    params.set(urlParamKeyMap.queryType, $query[urlParamKeyMap.queryType] ?? '')
    params.set(urlParamKeyMap.source, source.sId)
    let text = $query[urlParamKeyMap.query] ?? ''
    if (text) params.set(urlParamKeyMap.query, text)
    void replace(`/online?${params.toString()}`)
  }

  $effect(() => {
    if (!list.length) return
    if (activeSource && list.some((s) => s.sId == activeSource.sId)) return
    const s = list[0]
    untrack(() => {
      to(s)
    })
  })
</script>

<div class="online-search-music">
  {#if list.length}
    <Source
      {list}
      active={activeSource?.sId}
      onchange={(source) => {
        to(source)
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
    min-height: 0;
    padding-top: 10px;
  }
</style>

<script lang="ts">
  import Portal from '@/components/base/Portal.svelte'
  import { type ResourceListType, viewResourceMap } from '../shared'
  import { resourceList } from '@/modules/extension/reactive.svelte'
  import Tab from '@/components/base/Tab.svelte'
  import { i18n } from '@/plugins/i18n'
  import { query, replace } from '@/plugins/routes'
  import Music from './Music/Music.svelte'
  import Songlist from './Songlist/Songlist.svelte'
  import Album from './Album/Album.svelte'
  import Singer from './Singer/Singer.svelte'
  import { getSourceId } from './shared'

  const searchTypeMap = {
    musicSearch: 'music',
    songlistSearch: 'songlist',
    albumSearch: 'album',
    singerSearch: 'singer',
  } as const
  let activeType = $derived<(typeof searchTypeMap)[keyof typeof searchTypeMap]>(
    Object.values(searchTypeMap).find((t) => t == $query.searchType) ?? 'music'
  )

  let searchResource = $derived.by(() => {
    const searchRes: Partial<Record<(typeof viewResourceMap)['search'][number], ResourceListType[keyof ResourceListType]>> = {}
    for (const r of viewResourceMap.search) {
      searchRes[r] = []
    }
    const resourceListEntries = Object.entries($resourceList.resources) as EntriesObject<ResourceListType>
    for (const [key, source] of resourceListEntries) {
      if (key in searchRes) {
        searchRes[key as keyof typeof searchRes] = source
      }
    }
    return searchRes
  })

  const typeList = $derived.by(() => {
    let list: Array<{
      id: string
      href: string
      label: string
    }> = []
    for (const [type, source] of Object.entries(searchResource) as EntriesObject<typeof searchResource>) {
      if (!source!.length) continue
      const sType = searchTypeMap[type]
      let activeSource = $query.source
      list.push({
        id: sType,
        href: `/online?type=search&searchType=${sType}&source=${source!.some((s) => getSourceId(s) == activeSource) ? activeSource : getSourceId(source![0])}&text=${$query.text ?? ''}&page=1`,
        label: i18n.t(`online__search_type_${sType}`),
      })
    }
    return list
  })

  $effect(() => {
    if (!typeList.length) return
    if (typeList.some((s) => s.id == activeType)) return
    void replace(`/online?type=search&searchType=${typeList[0].id}`)
  })
  // $inspect(searchResource)
  // $inspect(activeType)
</script>

<Portal to="#online-header-right">
  <Tab list={typeList} itemkey="id" itemlabel="label" value={activeType} tagname="a" href="href" />
</Portal>

{#if activeType == 'music'}
  <Music sourceList={searchResource.musicSearch!} />
{:else if activeType == 'songlist'}
  <Songlist sourceList={searchResource.songlistSearch!} />
{:else if activeType == 'album'}
  <Album sourceList={searchResource.albumSearch!} />
{:else if activeType == 'singer'}
  <Singer sourceList={searchResource.singerSearch!} />
{/if}

<!-- <style lang="less">
.container {

}
</style> -->

<script lang="ts">
  import SearchInput from '@/components/material/SearchInput.svelte'
  import { getLocation, push } from '@/plugins/routes'
  import { debounce } from '@/shared'
  import type { ComponentExports } from 'svelte'

  let searchInput = $state<ComponentExports<typeof SearchInput> | null>(null)
  const data: [string, string[] | null] = ['', null]

  const tipSearch = debounce(async (text: string) => {
    if (data[0] == text && data[1]) return
    data[0] = text
    if (!text) {
      data[1] &&= null
      return
    }
    console.log('search', text)
    // if (searchText.value === '' && prevTempSearchSource) {
    //   tipList.value = []
    //   music[prevTempSearchSource].tipSearch.cancelTipSearch()
    //   return
    // }
    // const { temp_source } = await getSearchSetting()
    // prevTempSearchSource ||= temp_source
    // music[prevTempSearchSource].tipSearch
    //   .search(searchText.value)
    //   .then(list => {
    //     tipList.value = list
    //   })
    //   .catch(() => {})
  }, 50)

  const handleSubmit = (text: string) => {
    text = text.trim()
    // console.log('handleSubmit', text)
    const loc = getLocation()
    if (loc.location != '/online' || loc.query.type != 'search') {
      if (!text) return
      void push('/online', { type: 'search', searchType: 'music', text })
      return
    }
    void push('/online', { ...loc.query, text, page: 1 })
  }

  const handleListClick = (index: number, text: string) => {
    text = text.trim()
    console.log('handleListClick', text)
  }

  // let prevTempSearchSource = ''

  // const route = useRoute()
  // const router = useRouter()

  // watch(() => route.name, (newValue, oldValue) => {
  //   if (oldValue == 'Search' && newValue != 'SongListDetail') {
  //     setTimeout(() => {
  //       if (appSetting['odc.isAutoClearSearchInput'] && searchText.value) searchText.value = ''
  //       if (appSetting['odc.isAutoClearSearchList']) setSearchText('')
  //     })
  //   }
  // })

  // watch(_searchText, (newValue, oldValue) => {
  //   searchText.value = newValue
  //   if (newValue !== searchText.value) searchText.value = newValue
  // })
  // watch(searchText, () => {
  //   handleTipSearch()
  // })

  // const tipSearch = debounce(async() => {
  //   if (searchText.value === '' && prevTempSearchSource) {
  //     tipList.value = []
  //     music[prevTempSearchSource].tipSearch.cancelTipSearch()
  //     return
  //   }
  //   const { temp_source } = await getSearchSetting()
  //   prevTempSearchSource ||= temp_source
  //   music[prevTempSearchSource].tipSearch.search(searchText.value).then(list => {
  //     tipList.value = list
  //   }).catch(() => {})
  // }, 50)

  // const handleTipSearch = () => {
  //   if (!visibleList.value && isFocused) visibleList.value = true
  //   tipSearch()
  // }

  // const handleSearch = () => {
  //   visibleList.value &&= false
  //   if (!searchText.value && route.path != '/search') {
  //     setSearchText('')
  //     return
  //   }
  //   setTimeout(() => {
  //     router.push({
  //       path: '/search',
  //       query: {
  //         text: searchText.value,
  //       },
  //     }).catch(_ => _)
  //   }, searchText.value ? 200 : 0)
  // }

  // const handleEvent = ({ action, data }) => {
  //   switch (action) {
  //     case 'focus':
  //       isFocused = true
  //       visibleList.value ||= true
  //       if (searchText.value) handleTipSearch()
  //       break
  //     case 'blur':
  //       isFocused = false
  //       setTimeout(() => {
  //         visibleList.value &&= false
  //       }, 50)
  //       break
  //     case 'submit':
  //       handleSearch()
  //       break
  //     case 'listClick':
  //       searchText.value = tipList.value[data]
  //       void nextTick(handleSearch)
  //   }
  // }
</script>

<div style="display: flex; width: 100%; pointer-events: none; opacity: 0.2;">
  <SearchInput
    --width="45%"
    bind:this={searchInput}
    oninput={(text: string) => {
      tipSearch(text.trim())
    }}
    onsubmit={handleSubmit}
    onlistclick={handleListClick}
  />
</div>

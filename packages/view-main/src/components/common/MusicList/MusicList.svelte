<script lang="ts">
  import { settingState } from '@/modules/setting/store/state'
  import Header from './Header.svelte'
  import { playMusic } from './List/action'
  import List from './List/index.svelte'
  import type { ListInfo } from './type'
  import { updateSetting } from '@/modules/setting/store/action'
  import { getRandom } from '@/shared'
  import type { ComponentExports } from 'svelte'
  import MiniHeader from './MiniHeader.svelte'
  let {
    loading = false,
    error = false,
    local = false,
    showheader = true,
    miniheader = false,
    list,
    listinfo,
    onscroll,
  }: {
    loading?: boolean
    error?: boolean
    local?: boolean
    showheader?: boolean
    miniheader?: boolean
    list: AnyListen.Music.MusicInfo[]
    listinfo: ListInfo
    onscroll?: (pos: number) => void
  } = $props()
  let multimode = $state(false)
  let finding = $state(false)
  let duplicate = $state(false)
  let listsort = $state(false)
  let musicList = $state<ComponentExports<typeof List> | null>(null)

  export const setScrollPosition = (number: number, animate?: boolean) => {
    musicList?.setScrollPosition(number, animate)
  }
  export const setScrollIndex = (number: number, animate?: boolean) => {
    musicList?.setScrollIndex(number, animate)
  }
  export const getScrollPosition = () => {
    return musicList?.getScrollPosition() ?? 0
  }
</script>

<div class="view-container container">
  {#if showheader}
    {#if miniheader}
      <MiniHeader
        disabled={loading || error}
        musiccount={list.length}
        {local}
        {multimode}
        {finding}
        onfind={() => {
          finding = !finding
        }}
        onduplicate={() => {
          duplicate = true
        }}
        onmulti={() => {
          multimode = !multimode
        }}
        onplay={() => {
          void playMusic(listinfo.id, list[0], true)
        }}
        onplayrandom={async () => {
          if (settingState.setting['player.togglePlayMethod'] != 'random') {
            await updateSetting({ 'player.togglePlayMethod': 'random' })
          }
          void playMusic(listinfo.id, list[getRandom(0, list.length)], true)
        }}
        onsort={() => {
          listsort = true
        }}
      />
    {:else}
      <Header
        disabled={loading || error}
        {listinfo}
        musiccount={list.length}
        {local}
        {multimode}
        {finding}
        onfind={() => {
          finding = !finding
        }}
        onduplicate={() => {
          duplicate = true
        }}
        onmulti={() => {
          multimode = !multimode
        }}
        onplay={() => {
          void playMusic(listinfo.id, list[0], true)
        }}
        onplayrandom={async () => {
          if (settingState.setting['player.togglePlayMethod'] != 'random') {
            await updateSetting({ 'player.togglePlayMethod': 'random' })
          }
          void playMusic(listinfo.id, list[getRandom(0, list.length)], true)
        }}
        onsort={() => {
          listsort = true
        }}
      />
    {/if}
  {/if}
  <List bind:this={musicList} {listinfo} {list} {local} {onscroll} bind:finding bind:multimode bind:duplicate bind:listsort />
</div>

<style lang="less">
  .container {
    position: relative;
    display: flex;
    flex: auto;
    flex-flow: column nowrap;
  }
</style>

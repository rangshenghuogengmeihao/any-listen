<script lang="ts">
  import Btn from '@/components/base/Btn.svelte'
  import SvgIcon from '@/components/base/SvgIcon.svelte'
  import { addListMusics, getListMusics, removeListMusics } from '@/modules/musicLibrary/actions'
  import { musicLibraryEvent } from '@/modules/musicLibrary/store/event'
  import { t } from '@/plugins/i18n'
  import { LIST_IDS } from '@any-listen/common/constants'
  import { onMount } from 'svelte'

  let {
    musicinfo,
  }: {
    musicinfo: AnyListen.Music.MusicInfo
  } = $props()

  let loved = $state(false)

  onMount(() => {
    const handleLoveListChange = async () => {
      const list = await getListMusics(LIST_IDS.LOVE)
      loved = list.some((m) => m.id === musicinfo.id)
    }
    void handleLoveListChange()

    return musicLibraryEvent.on('listMusicChanged', (ids) => {
      if (!ids.includes(LIST_IDS.LOVE)) return
      void handleLoveListChange()
    })
  })
</script>

<Btn
  onclick={async (evt) => {
    evt.stopPropagation()
    if (loved) {
      await removeListMusics(LIST_IDS.LOVE, [musicinfo.id])
    } else {
      await addListMusics(LIST_IDS.LOVE, [musicinfo])
    }
  }}
  min
  icon
  class={loved ? ['love-btn'] : ['love-btn', 'unloved']}
  aria-label={loved ? $t('music_unlove') : $t('music_love')}
>
  <SvgIcon name="music_heart" />
</Btn>

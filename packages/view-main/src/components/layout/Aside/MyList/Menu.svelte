<script lang="ts">
  import { onMount, tick } from 'svelte'
  import { t } from '@/plugins/i18n'
  import Menu, { type MenuItem, type MenuList } from '@/components/base/Menu.svelte'
  import { LIST_IDS } from '@any-listen/common/constants'
  import { importLocalFile, importLocalFileFolder, removeUserList } from './action'
  import { showListEditModal } from '@/components/apis/listEditModal'
  import { musicLibraryEvent } from '@/modules/musicLibrary/store/event'

  let {
    onhide,
  }: {
    onhide?: () => void
  } = $props()

  type MenuType =
    | 'create'
    | 'edit'
    | 'sort'
    | 'duplicate'
    | 'local_file'
    | 'local_file_folder'
    | 'update'
    | 'sourceDetail'
    | 'import'
    | 'export'
    | 'remove'
  let menuVisible = $state.raw(false)
  let menuLocation = $state.raw({ x: 0, y: 0 })
  let menus = $state.raw<MenuList<MenuType>>([])
  let info: AnyListen.List.MyListInfo | null
  let fetching = false

  const setMenu = () => {
    if (!info) {
      menus = [{ action: 'create', label: $t('user_list_menu__create') }]
      return
    }
    let edit = false
    let update = false
    let remove = false
    // let local_file = !listState.fetchingListStatus[listInfo.id]
    let userList: AnyListen.List.UserListInfo
    switch (info.id) {
      case LIST_IDS.DEFAULT:
      case LIST_IDS.LOVE:
        break
      default:
        userList = info as AnyListen.List.UserListInfo
        edit = true
        remove = true
        update = userList.type != 'general'
        break
    }

    menus = [
      { action: 'create', label: $t('user_list_menu__create') },
      { action: 'edit', disabled: !edit, label: $t('user_list_menu__edit') },
      { action: 'local_file', disabled: fetching, label: $t('user_list_menu__select_local_file') },
      { action: 'local_file_folder', disabled: fetching, label: $t('user_list_menu__select_local_file_folder') },
      { action: 'update', disabled: !update || fetching, label: $t('user_list_menu__sync') },
      // null,
      // { action: 'sort', label: $t('user_list_menu__sort_list') },
      // { action: 'duplicate', label: $t('user_list_menu__duplicate') },
      // { action: 'sourceDetail', label: $t('user_list_menu__source_detail') },
      // { action: 'import', label: $t('user_list_menu__import') },
      // { action: 'export', label: $t('user_list_menu__export') },
      null,
      { action: 'remove', disabled: !remove || fetching, label: $t('user_list_menu__remove') },
    ]
  }

  export const show = async (selectInfo: AnyListen.List.MyListInfo | null, position: { x: number; y: number }) => {
    info = selectInfo
    menuLocation = position
    setMenu()
    await tick()
    menuVisible = true
  }

  const handleClick = (menu: MenuItem<MenuType>) => {
    switch (menu.action) {
      case 'create':
        void showListEditModal(info?.id)
        break
      case 'edit':
        void showListEditModal(info!.id, true)
        break
      case 'local_file':
        void importLocalFile(info!)
        break
      case 'local_file_folder':
        void importLocalFileFolder(info!)
        break
      case 'remove':
        void removeUserList(info!.id)
        break

      default:
        break
    }
    menuVisible = false
  }

  onMount(() => {
    const unsub = musicLibraryEvent.on('fetchingListStatusUpdated', (_id, status) => {
      if (info?.id != _id) return
      fetching = status
      setMenu()
    })

    return () => {
      unsub()
    }
  })
</script>

<Menu bind:visible={menuVisible} {menus} location={menuLocation} onclick={handleClick} {onhide} />

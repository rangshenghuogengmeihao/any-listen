<script lang="ts">
  import { t } from '@/plugins/i18n'
  import { createUserList, editUserList } from './shared'
  import Input from '@/components/base/Input.svelte'

  let {
    item,
    targetId,
  }: {
    item?: AnyListen.List.OnlineListInfo | null
    targetId?: AnyListen.List.ParentId
  } = $props()

  const initData: AnyListen.List.OnlineListInfo = {
    id: '',
    name: '',
    parentId: null,
    type: 'online',
    meta: {
      createTime: 0,
      updateTime: 0,
      desc: '',
      playCount: 0,
      posTime: 0,
      extensionId: '',
      source: '',
      syncId: '',
      picUrl: null,
      syncTime: 0,
    },
  }
  let listInfo = $state<AnyListen.List.OnlineListInfo>({
    ...initData,
    meta: { ...initData.meta },
  })

  export const verify = () => {
    const name = listInfo.name.trim()
    if (!name.length || name.length > 30) {
      return false
    }
    return true
  }
  export const reset = () => {
    listInfo = {
      ...initData,
      meta: { ...initData.meta },
    }
  }
  export const submit = async () => {
    if (!verify()) return
    if (item) {
      await editUserList(listInfo)
    } else {
      await createUserList({ ...listInfo, parentId: targetId || null })
    }
  }

  $effect(() => {
    if (!item) return
    listInfo = {
      ...item,
      meta: { ...item.meta },
    }
  })
</script>

<main class="main">
  <Input autofocus placeholder={$t('edit_list_modal__form_list_name')} bind:value={listInfo.name} />
</main>

<style lang="less">
  .main {
    display: flex;
    // flex: auto;
    // padding: 0 15px;
    // width: 320px;
    flex-flow: column nowrap;
    // min-height: 0;
    // max-height: 100%;
    // overflow: hidden;
  }
</style>

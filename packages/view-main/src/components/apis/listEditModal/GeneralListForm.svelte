<script lang="ts">
  import { i18n, t } from '@/plugins/i18n'
  import { createUserList, editUserList } from './shared'
  import Input from '@/components/base/Input.svelte'

  let {
    item,
    targetId,
  }: {
    item?: AnyListen.List.GeneralListInfo | null
    targetId?: AnyListen.List.ParentId
  } = $props()

  const initData: AnyListen.List.GeneralListInfo = {
    id: '',
    name: '',
    parentId: null,
    type: 'general',
    meta: {
      createTime: 0,
      updateTime: 0,
      desc: '',
      playCount: 0,
      posTime: 0,
    },
  }
  let listInfo = $state<AnyListen.List.GeneralListInfo>({
    ...initData,
    meta: { ...initData.meta },
  })

  export const verify = () => {
    const name = listInfo.name.trim()
    if (!name.length || name.length > 30) {
      throw new Error(i18n.t('edit_list_modal__form_err_name'))
    }
  }
  export const reset = () => {
    listInfo = {
      ...initData,
      meta: { ...initData.meta },
    }
  }
  export const submit = async () => {
    verify()
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

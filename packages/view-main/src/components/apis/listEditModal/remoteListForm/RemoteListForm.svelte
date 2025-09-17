<script lang="ts">
  import { i18n, t } from '@/plugins/i18n'
  import { createUserList, editUserList } from '../shared'
  import Input from '@/components/base/Input.svelte'
  import SourceSelect from './SourceSelect.svelte'
  import ProviderForm from './ProviderForm.svelte'
  import { extI18n } from '@/modules/extension/i18n'
  import { resourceList } from '@/modules/extension/reactive.svelte'

  let {
    item,
    targetId,
  }: {
    item?: AnyListen.List.RemoteListInfo | null
    targetId?: AnyListen.List.ParentId
  } = $props()

  const initData: AnyListen.List.RemoteListInfo = {
    id: '',
    name: '',
    parentId: null,
    type: 'remote',
    meta: {
      createTime: 0,
      updateTime: 0,
      desc: '',
      playCount: 0,
      posTime: 0,
      extensionId: '',
      source: '',
      syncTime: 0,
    },
  }
  let listInfo = $state<AnyListen.List.RemoteListInfo>({
    ...initData,
    meta: { ...initData.meta },
  })
  let provider = $state<AnyListen.Extension.ListProviderResource | null>(null)
  let formList = $derived.by(() => {
    if (!provider) return []
    const extId = provider.extensionId
    return (
      provider.form.map((s) => {
        const ss = {
          ...s,
          value: listInfo.meta[s.field] as any,
          name: extI18n.t(extId, s.name),
          description: extI18n.t(extId, s.description),
        } satisfies AnyListen.Extension.FormValueItem
        if (ss.type == 'selection') {
          ss.enumName = ss.enumName.map((n) => extI18n.t(extId, n))
        }
        return ss
      }) ?? []
    )
  })

  export const verify = () => {
    const name = listInfo.name.trim()
    if (!name.length || name.length > 30) {
      throw new Error(i18n.t('edit_list_modal__form_err_name'))
    }
    if (!listInfo.meta.extensionId) {
      throw new Error(i18n.t('edit_list_modal__form_err_source'))
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
      await editUserList({ ...listInfo, meta: { ...listInfo.meta } })
    } else {
      await createUserList({ ...listInfo, meta: { ...listInfo.meta }, parentId: targetId || null })
    }
  }

  $effect(() => {
    listInfo.meta.extensionId = provider?.extensionId || ''
    listInfo.meta.source = provider?.id || ''
  })
  $effect(() => {
    if (!item) return
    listInfo = {
      ...item,
      meta: { ...item.meta },
    }
  })
  $effect(() => {
    if (!item) return
    provider = item.meta.extensionId
      ? $resourceList.listProvider.find((p) => p.extensionId == item.meta.extensionId && p.id == item.meta.source) || null
      : null
  })
</script>

<main class="main">
  <Input autofocus placeholder={$t('edit_list_modal__form_list_name')} bind:value={listInfo.name} />
  <SourceSelect bind:value={provider} disabled={!!item} />
  {#if provider}
    <ProviderForm
      list={formList}
      onchange={(field, value) => {
        listInfo.meta[field] = value as string | number | boolean
      }}
    />
  {/if}
</main>

<style lang="less">
  .main {
    display: flex;
    flex: auto;
    // padding: 0 15px;
    // width: 320px;
    flex-flow: column nowrap;
    gap: 10px;
    min-height: 0;
    // max-height: 100%;
    // overflow: hidden;
  }
</style>

<script lang="ts">
  import Modal from '@/components/material/Modal.svelte'
  import Btn from '@/components/base/Btn.svelte'
  import { extensionList } from '@/modules/extension/reactive.svelte'
  import { extI18n } from '@/modules/extension/i18n'
  import { openUrl } from '@/shared/ipc/app'

  let {
    onafterleave,
  }: {
    onafterleave: () => void
  } = $props()

  let visible = $state(false)
  let select = $state(false)
  let message = $state<[string, string]>(['', ''])
  let buttons = $state<readonly AnyListen.IPCCommon.MessageButton[]>([])
  let extId = $state('')
  let promise: [(result: number) => void, (error: Error) => void] | null = null
  let extensionName = $derived.by(() => {
    if (!extId) return ''
    const ext = $extensionList.find((ext) => ext.id === extId)
    return ext ? extI18n.t(extId, ext.name) : ''
  })

  const closeModal = () => {
    visible = false
  }

  const handleComfirm = (btn: AnyListen.IPCCommon.MessageButton) => {
    if (btn.link && /^https?:\/\//.test(btn.link)) {
      void openUrl(btn.link)
    }
    promise?.[0](buttons.indexOf(btn))
    closeModal()
  }

  const handleAfterLeave = () => {
    onafterleave?.()
  }
  export const show = async (
    _extId: string,
    _buttons: readonly AnyListen.IPCCommon.MessageButton[],
    _title?: string,
    _message?: string,
    _select?: boolean
  ) => {
    extId = _extId
    message = [_title ?? '', _message ?? '']
    buttons = _buttons
    select = _select ?? false
    visible = true
    return new Promise<number>((resolve, reject) => {
      promise = [resolve, reject]
    })
  }
  export const hide = () => {
    visible = false
    promise?.[1](new Error('cancel'))
  }

  // $effect(() => {
  //   if (!visible) return
  // })
</script>

<Modal
  bind:visible
  teleport="#root"
  minheight="140px"
  bgclose={false}
  closebtn={false}
  title={extensionName}
  onafterleave={handleAfterLeave}
>
  <div class="main" class:select>
    {#if message[0]}
      <h3>{message[0]}</h3>
    {/if}
    {message[1]}
  </div>
  <div class="footer">
    <!-- <Btn onclick={closeModal}>{$t('btn_cancel')}</Btn> -->
    {#each buttons as btn (btn.text)}
      <Btn
        onclick={() => {
          handleComfirm(btn)
        }}
        >{btn.text}
      </Btn>
    {/each}
  </div>
</Modal>

<style lang="less">
  .main {
    flex: auto;
    min-height: 40px;
    padding: 15px 15px 0;
    font-size: 14px;
    // max-width: 320px;
    min-width: 320px;
    line-height: 1.5;
    white-space: pre-line;
    &.select {
      user-select: text;
    }
  }

  .footer {
    flex: none;
    padding: 15px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    gap: 15px;

    :global(.btn) {
      min-width: 70px;
    }
  }
</style>

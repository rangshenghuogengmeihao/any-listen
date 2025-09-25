<script lang="ts">
  import InputItem from '../components/InputItem.svelte'
  import { updateExtensionSettings } from '@/shared/ipc/extension'
  import CheckboxItem from '../components/CheckboxItem.svelte'
  import SelectionItem from '../components/SelectionItem.svelte'

  let {
    id,
    item,
  }: {
    id: string
    item: AnyListen.Extension.FormValueItem
  } = $props()
</script>

<div class="settings-item">
  {#if item.type === 'input'}
    <InputItem
      id={`extenstion_${item.field}_${item.type}`}
      name={item.name}
      desc={item.description}
      textarea={item.textarea}
      value={item.value ?? item.default}
      onchange={(val) => {
        void updateExtensionSettings(id, { [item.field]: val.trim() })
      }}
    />
  {:else if item.type === 'boolean'}
    <CheckboxItem
      id={`extenstion_${item.field}_${item.type}`}
      name={item.name}
      desc={item.description}
      checked={item.value ?? item.default}
      onchange={(val) => {
        void updateExtensionSettings(id, { [item.field]: val })
      }}
    />
  {:else if item.type === 'selection'}
    <SelectionItem
      name={item.name}
      desc={item.description}
      value={item.value ?? item.default}
      list={item.enum.map((n, idx) => ({ label: item.enumName[idx], value: n }))}
      onchange={(val) => {
        void updateExtensionSettings(id, { [item.field]: val })
      }}
    />
  {/if}
</div>

<style lang="less">
  // .settings-item {
  //   padding-right: 10px;
  // }
</style>

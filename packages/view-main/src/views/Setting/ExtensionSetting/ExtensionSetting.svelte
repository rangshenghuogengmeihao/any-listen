<script lang="ts">
  import { extI18n, extT } from '@/modules/extension/i18n'
  import { query, replace } from '@/plugins/routes'
  import ExtenstionList from './ExtenstionList.svelte'
  import SettingView from './SettingView.svelte'
  import { onMount } from 'svelte'
  import { getAllExtensionSettings } from '@/modules/extension/store/actions'
  import { extensionEvent } from '@/modules/extension/store/event'
  import type { ExtenstionListItem } from './shared'

  let extSettings = $state<AnyListen.Extension.ExtensionSetting[]>([])

  const settings = $derived.by(() => {
    return extSettings.map((extension) => {
      return {
        id: extension.id,
        name: $extT(extension.id, extension.name),
        settings: extension.settingItems.map((s) => {
          const ss = {
            ...s,
            name: extI18n.t(extension.id, s.name),
            description: extI18n.t(extension.id, s.description),
          }
          if (ss.type == 'selection') {
            ss.enumName = ss.enumName.map((n) => extI18n.t(extension.id, n))
          }
          return ss
        }),
      }
    })
  })
  const activeExt = $derived(Object.values(settings).find((e) => e.id == $query.id) ?? settings[0])

  onMount(() => {
    // TODO reload setting when list updated
    void getAllExtensionSettings().then((settings) => {
      extSettings = settings
    })

    const unsub = extensionEvent.on('extenstionSettingUpdated', (setting) => {
      const targetExt = extSettings.find((e) => e.id == setting.id)
      if (!targetExt) return
      for (const [field, value] of Object.entries(setting.setting)) {
        const targetSetting = targetExt.settingItems.find((ss) => ss.field == field)
        if (!targetSetting) continue
        targetSetting.value = value as string | boolean
      }
    })

    return () => {
      unsub()
    }
  })

  // $inspect(settings)
</script>

<div class="settings-extension-container">
  {#if settings.length}
    <ExtenstionList
      list={settings}
      active={activeExt.id}
      onchange={(ext: ExtenstionListItem) => {
        void replace('/settings', { type: 'extension', id: ext.id })
      }}
    />
  {/if}
  {#if activeExt}
    <SettingView id={activeExt.id} name={activeExt.name} list={activeExt.settings} />
  {/if}
</div>

<style lang="less">
  .settings-extension-container {
    display: flex;
    flex-flow: row nowrap;
    height: 100%;
    min-height: 0;
    padding-top: 10px;
  }
</style>

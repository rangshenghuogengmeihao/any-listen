<script lang="ts">
  import Header from './Header.svelte'
  import { query } from '@/plugins/routes'
  import { viewTypes } from './shared'
  import AppSetting from './AppSetting/AppSetting.svelte'
  import ExtensionSetting from './ExtensionSetting/ExtensionSetting.svelte'
  import Logs from './Logs/Logs.svelte'

  const activeView = $derived<(typeof viewTypes)[number]>(viewTypes.find((t) => t == $query.type) ?? 'app')
</script>

<div class="view-container container">
  <Header activeview={activeView} />
  {#if activeView == 'app'}
    <AppSetting />
  {:else if activeView == 'extension'}
    <ExtensionSetting />
  {:else if activeView == 'logs'}
    <Logs />
  {/if}
</div>

<style lang="less">
  .container {
    // padding: 10px 15px;
    display: flex;
    flex-flow: column nowrap;

    :global {
      .settings-item {
        padding-right: 10px;
        + .settings-item {
          :global {
            .settings-item-title-container {
              margin-top: 14px;
            }
          }
        }
      }
      .settings-title {
        border-left: 5px solid var(--color-primary-alpha-700);
        padding: 3px 7px;
        margin-bottom: 15px;
        margin-top: 6px;
        font-size: 15px;
      }
    }
  }
</style>

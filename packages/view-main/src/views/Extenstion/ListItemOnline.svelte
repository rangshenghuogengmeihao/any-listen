<script lang="ts">
  import Btn from '@/components/base/Btn.svelte'
  import Image from '@/components/base/Image.svelte'
  import SvgIcon from '@/components/base/SvgIcon.svelte'
  import { i18n, t } from '@/plugins/i18n'
  import ActionBtnOnline from './ActionBtnOnline.svelte'
  import type { OnlineListItem } from '@/modules/extension/store/state'
  import { extT } from '@/modules/extension/i18n'
  import { downloadAndParseExtension, updateExtension, installExtension } from '@/modules/extension/store/actions'
  import { showNotify } from '@/components/apis/notify'
  import { tooltip } from '@/components/apis/tooltips'

  let { ext }: { ext: OnlineListItem } = $props()
  let version = $derived(`${ext.installed && !ext.latest ? `v${ext.currentVersion} → ` : ''}v${ext.version}`)
  let grants = $derived(ext.grant.map((g) => ({ id: g, icon: `ext_grant_${g}`, label: i18n.t(`extension__grant_${g}`) })))
  const handleInstall = async (ext: OnlineListItem, install?: boolean) => {
    // TODO
    try {
      const tempExt = await downloadAndParseExtension(ext.download_url)
      if (install) {
        await updateExtension(tempExt)
      } else {
        await installExtension(tempExt)
      }
    } catch (error) {
      console.error('Failed to install extension:', error)
      // Show an error message to the user
      showNotify(i18n.t('extension.install_failed', { name: ext.name, err: (error as Error).message }))
      return
    }
    showNotify(i18n.t('extension.install_success', { name: ext.name }))
  }
</script>

<li class="list-item" class:disabled={ext.installed && !ext.enabled}>
  <div class="top">
    <div class="left">
      <Image src={ext.icon} />
    </div>
    <div class="right">
      <h3>{ext.name}</h3>
      {#if ext.description}
        <p class="label">{$extT(ext.id, ext.description)}</p>
      {/if}
    </div>
  </div>
  <div class="footer">
    <div class="left">
      {#if grants.length}
        <div class="grant">
          {#each grants as grant (grant.id)}
            <span aria-label={grant.label} data-ignore-tip use:tooltip><SvgIcon name={grant.icon} /></span>
          {/each}
        </div>
      {/if}
      <p class="label" aria-label={version}>
        {version}
      </p>
      {#if ext.author}
        <p class="author">{ext.author}</p>
      {/if}
    </div>
    <div class="right">
      {#if ext.installed}
        {#if !ext.latest}
          <Btn
            min
            onclick={async () => {
              await handleInstall(ext, true)
            }}
          >
            {$t('extension__action_update')}
          </Btn>
        {/if}
        <ActionBtnOnline {ext} />
      {:else}
        <Btn
          min
          onclick={async () => {
            await handleInstall(ext)
          }}
        >
          {$t('extension__action_install')}
        </Btn>
      {/if}
    </div>
  </div>
</li>

<style lang="less">
  .list-item {
    flex: 1;
    min-width: 300px;
    max-width: 440px;
    height: 100px;
    display: flex;
    flex-flow: column nowrap;
    padding: 10px;
    border-radius: @radius-border;
    gap: 6px;
    background-color: var(--color-primary-light-200-alpha-900);
    transition: opacity @transition-normal;

    &.disabled {
      opacity: 0.6;
    }
    &:hover {
      opacity: 0.8;
      // background-color: var(--color-primary-light-500-alpha-900);
    }
  }
  .top {
    flex: auto;
    min-height: 0;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 10px;

    .left {
      height: 100%;
      aspect-ratio: 1;
      flex: none;
    }
    .right {
      flex: auto;
      height: 100%;
      min-width: 0;
      display: flex;
      flex-flow: column nowrap;
      gap: 2px;
      // justify-content: space-between;
      // .title {
      //   display: flex;
      //   flex-flow: row nowrap;
      //   // align-items: flex-end;
      //   gap: 5px;
      //   justify-content: space-between;
      h3 {
        .auto-hidden();
        font-size: 14px;
      }
      //   p {
      //     flex: none;
      //   }
      // }
      .label {
        color: var(--color-font-label);
        .mixin-ellipsis-2();
        font-size: 12px;
      }
    }
  }
  .footer {
    flex: none;
    display: flex;
    gap: 10px;
    flex-flow: row nowrap;
    justify-content: space-between;
    .left {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      gap: 10px;
      min-width: 0;
      .grant {
        flex: none;
        display: flex;
        flex-flow: row nowrap;
        color: var(--color-primary-alpha-600);
        gap: 8px;
      }
      .author {
        color: var(--color-font-label);
        font-size: 12px;
        .auto-hidden();
      }
      .label {
        flex: none;
        max-width: 120px;
        color: var(--color-font-label);
        font-size: 12px;
        .auto-hidden();
      }
      // .load-time {
      //   flex: none;
      //   color: var(--color-font-label);
      //   font-size: 13px;
      // }
    }
    .right {
      flex: none;
      display: flex;
      flex-flow: row nowrap;
      font-size: 16px;
      gap: 10px;
    }
  }
</style>

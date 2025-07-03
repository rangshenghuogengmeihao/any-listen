<script lang="ts">
  import { useDownloadProgress, useIgnoreVersion, useVersionInfo } from '@/modules/version/reactive.svelte'
  import Modal from '@/components/material/Modal.svelte'
  import Btn from '@/components/base/Btn.svelte'
  import { arrUnshift, compareVersions, dateFormat, sizeFormate } from '@/shared'
  import { openUrl } from '@/shared/ipc/app'
  import {
    checkUpdate,
    restartUpdate,
    downloadUpdate,
    ignoreFailTip,
    isIgnoreFileTip,
    saveIgnoreVersion,
  } from '@/modules/version/store/actions'
  import { onMount } from 'svelte'
  import { showNotify } from '../notify'
  import { i18n, t } from '@/plugins/i18n'
  import { useSettingValue } from '@/modules/setting/reactive.svelte'
  import { verticalScrollbar } from '@/shared/compositions/verticalScrollbar'
  import { parseMarkdown, parseMarkdowns } from '@/shared/tools'
  /* eslint svelte/no-at-html-tags: "off" */

  let {
    onafterleave,
  }: {
    onafterleave: () => void
  } = $props()

  const versionInfo = useVersionInfo()
  const downloadProgress = useDownloadProgress()
  const ignoreVersion = useIgnoreVersion()
  const allowPreRelease = useSettingValue('common.allowPreRelease')

  let urls = import.meta.env.VITE_IS_WEB
    ? {
        release: 'https://github.com/any-listen/any-listen-web-server/releases',
      }
    : {
        release: 'https://github.com/any-listen/any-listen-desktop/releases',
      }

  let disabledIgnoreFailBtn = $state(false)
  let visible = $state(false)

  let [latest, history] = $derived.by<[AnyListen.VersionInfo | null, AnyListen.VersionInfo[]]>(() => {
    if (!versionInfo.val.newVersion) return [null, []]
    let history = [...(versionInfo.val.newVersion?.history ?? [])]
    let latest: AnyListen.VersionInfo = {
      version: versionInfo.val.newVersion.version,
      desc: versionInfo.val.newVersion.desc,
      time: versionInfo.val.newVersion.time,
    }
    if (allowPreRelease.val && versionInfo.val.newVersion.beta?.length) {
      history.unshift({
        version: versionInfo.val.newVersion.version,
        desc: versionInfo.val.newVersion.desc,
        time: versionInfo.val.newVersion.time,
      })
      arrUnshift(history, versionInfo.val.newVersion.beta)
      latest = history.shift()!
    }
    let arr: AnyListen.VersionInfo[] = []
    let currentVer = versionInfo.val.version
    for (const ver of history) {
      if (compareVersions(currentVer, ver.version) < 0) {
        const v = { ...ver }
        v.time &&= dateFormat(new Date(v.time))
        arr.push(v)
      } else break
    }
    latest.time &&= dateFormat(new Date(latest.time))
    return [latest, arr]
  })
  let progress = $derived(
    versionInfo.val.status == 'downloading'
      ? downloadProgress.val
        ? `${downloadProgress.val.percent.toFixed(2)}% - ${sizeFormate(downloadProgress.val.transferred)}/${sizeFormate(downloadProgress.val.total)} - ${sizeFormate(downloadProgress.val.bytesPerSecond)}/s`
        : i18n.t('update_modal.update_handing')
      : ''
  )
  let parsedDesc = $state.raw(null as string | null)
  let parsedHistoryDesc = $state.raw(null as Array<string | null> | null)

  $effect(() => {
    if (!latest) return
    let unmunted = false
    void parseMarkdown(latest.desc).then((desc) => {
      if (unmunted) return
      parsedDesc = desc
    })
    return () => {
      unmunted = true
    }
  })
  $effect(() => {
    if (!history.length) return
    let unmunted = false
    void parseMarkdowns(history.map((v) => v.desc)).then((descs) => {
      if (unmunted) return
      parsedHistoryDesc = descs
    })
    return () => {
      unmunted = true
    }
  })

  let isIgnored = $derived(ignoreVersion.val == latest?.version)

  const handleOpenUrl = (url: string) => {
    void openUrl(url)
  }

  const handleLogClick = (e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const target = e.target as HTMLElement
    if (target.tagName === 'A' && (target as HTMLLinkElement).href) {
      handleOpenUrl((target as HTMLLinkElement).href)
    }
  }

  onMount(() => {
    disabledIgnoreFailBtn = isIgnoreFileTip()
  })

  const handleCheckUpdate = () => {
    void checkUpdate().then((hasNewVer) => {
      if (hasNewVer) {
        showNotify(i18n.t('update_modal.check_result_new'))
      } else {
        showNotify(i18n.t('update_modal.check_result_latest'))
      }
    })
  }

  export const setVisible = (val: boolean) => {
    visible = val
  }
</script>

{#snippet releaseTime(time?: string)}
  {#if time}
    <span class="release-time">&nbsp;-&nbsp;{time}</span>
  {/if}
{/snippet}

{#snippet versionSnippet()}
  <div class="version-modal-content">
    <div class="select info" use:verticalScrollbar>
      <div class="current">
        <h3>{$t('update_modal.current_version')}{versionInfo.val.version}</h3>
        <h3>
          {$t('update_modal.latest_version')}{latest?.version}{@render releaseTime(latest?.time)}
        </h3>
        <h3>{$t('update_modal.change_log')}</h3>
        {#if parsedDesc}
          <div class="log" role="presentation" onclick={handleLogClick}>{@html parsedDesc}</div>
        {:else}
          <pre class="log">{latest?.desc}</pre>
        {/if}
      </div>
      {#if history.length}
        <div class="history desc">
          <h3>{$t('update_modal.history_version')}</h3>
          {#each history as ver, index (ver.version)}
            {@const log = parsedHistoryDesc?.[index]}
            <div class="item">
              <h4>v{ver.version}{@render releaseTime(ver?.time)}</h4>
              {#if log}
                <div class="log" role="presentation" onclick={handleLogClick}>{@html log}</div>
              {:else}
                <pre class="log">{latest?.desc}</pre>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/snippet}

<Modal teleport="#root" bind:visible maxwidth="72%" {onafterleave} minheight="0">
  {#if versionInfo.val.isLatest}
    <main class="version-modal-main">
      <h2>{$t('update_modal.latest_title')}</h2>
      {@render versionSnippet()}
      <div class="footer">
        <div class="btns btn">
          {#if versionInfo.val.status == 'checking'}
            <Btn disabled>{$t('update_modal.update_checking')}</Btn>
          {:else}
            <Btn onclick={handleCheckUpdate}>
              {$t('update_modal.recheck_update')}
            </Btn>
          {/if}
        </div>
      </div>
    </main>
  {:else if versionInfo.val.isUnknown}
    <main class="version-modal-main">
      <h2>{$t('update_modal.unknown_title')}</h2>
      <div class="version-modal-content">
        <div class="select info" use:verticalScrollbar>
          <div class="current">
            <h3>{$t('update_modal.current_version')}{versionInfo.val.version}</h3>
            <div class="desc">
              <p>{$t('update_modal.unknown_desc_1')}</p>
              <p>
                {$t('update_modal.unknown_desc_2_1')}
                <Btn
                  min
                  aria-label={urls.release}
                  onclick={() => {
                    handleOpenUrl(urls.release)
                  }}
                >
                  {$t('update_modal.unknown_desc_2_2')}
                </Btn>
                {$t('update_modal.unknown_desc_2_3')}
                <strong>{$t('update_modal.unknown_desc_2_4')}</strong>{$t('update_modal.unknown_desc_2_5', {
                  ver: versionInfo.val.version,
                })}
              </p>
              <p>{$t('update_modal.unknown_desc_3')}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="btns btn2">
          {#if versionInfo.val.status == 'error'}
            <Btn onclick={handleCheckUpdate}>{$t('update_modal.recheck_update')}</Btn>
          {:else}
            <Btn disabled>{$t('update_modal.update_checking')}</Btn>
          {/if}
          <Btn
            disabled={disabledIgnoreFailBtn}
            onclick={() => {
              ignoreFailTip()
              disabledIgnoreFailBtn = true
            }}>{$t('update_modal.unknown_hide_tip_btn')}</Btn
          >
        </div>
      </div>
    </main>
  {:else if versionInfo.val.status == 'downloaded'}
    <main class="version-modal-main">
      <h2>{$t('update_modal.downloaded_title')}</h2>
      {@render versionSnippet()}
      <div class="footer">
        <div class="desc">
          <p>{$t('update_modal.downloaded_desc_1')}</p>
          <p>
            {$t('update_modal.downloaded_desc_2_1')}
            <strong>{$t('update_modal.downloaded_desc_2_2')}</strong>
            {$t('update_modal.downloaded_desc_2_3')}
            <strong>{$t('update_modal.downloaded_desc_2_4')}</strong>
            {$t('update_modal.downloaded_desc_2_5')}
          </p>
        </div>
        <div class="btns btn">
          <Btn onclick={restartUpdate}>{$t('update_modal.downloaded_restart_btn')}</Btn>
        </div>
      </div>
    </main>
  {:else}
    <main class="version-modal-main">
      <h2>{$t('update_modal.new_ver_title')}</h2>
      {@render versionSnippet()}
      <div class="footer">
        <div class="desc">
          {#if progress}
            <p>{$t('update_modal.cur_progress')}{progress}</p>
          {:else}
            <p>&nbsp;</p>
          {/if}
          <p>{$t('update_modal.new_ver_desc_1')}</p>
          <p>
            {$t('update_modal.new_ver_desc_2_1')}&nbsp;
            <strong
              role="presentation"
              class="hover underline"
              aria-label={urls.release}
              onclick={() => {
                handleOpenUrl(urls.release)
              }}
            >
              {$t('update_modal.new_ver_desc_2_2')}
            </strong>
            {$t('update_modal.new_ver_desc_2_3')}
          </p>
          <!-- <p>
            若遇到问题可以阅读
            <strong
              role="presentation"
              class="hover underline"
              aria-label="点击打开"
              onclick={() => {
                handleOpenUrl('https://lyswhut.github.io/lx-music-doc/desktop/faq')
              }}
            >
              桌面版常见问题
            </strong>
            。
          </p> -->
        </div>
        <div class="btns btn2">
          <Btn
            onclick={async () => {
              await saveIgnoreVersion(isIgnored ? null : (latest?.version ?? null))
            }}>{isIgnored ? $t('update_modal.ignore_ver_cancel') : $t('update_modal.ignore_ver')}</Btn
          >
          {#if versionInfo.val.status == 'downloading'}
            <Btn disabled>{$t('update_modal.update_downloading')}</Btn>
          {:else}
            <Btn onclick={downloadUpdate}>{$t('update_modal.download')}</Btn>
          {/if}
        </div>
      </div>
    </main>
  {/if}
</Modal>

<style lang="less">
  .version-modal-main {
    position: relative;
    padding: 15px 0;
    // max-width: 450px;
    min-width: 500px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    overflow: hidden;
    // overflow-y: auto;
    * {
      box-sizing: border-box;
    }
    h2 {
      flex: 0 0 none;
      font-size: 16px;
      color: var(--color-font);
      line-height: 1.3;
      text-align: center;
      margin-bottom: 15px;
    }
    h3 {
      font-size: 14px;
      line-height: 1.3;
    }
    pre {
      white-space: pre-wrap;
      text-align: justify;
      margin-top: 10px;
    }
  }
  .version-modal-content {
    flex: 1 1 auto;
    overflow: hidden;
    display: flex;
    flex-flow: column nowrap;
  }
  .release-time {
    color: var(--color-font-label);
    font-size: 12px;
    // margin-left: 5px;
    font-weight: normal;
  }

  .info {
    flex: 1 1 auto;
    font-size: 14px;
    line-height: 1.5;
    overflow-y: auto;
    height: 100%;
    padding: 0 15px;
  }

  .history {
    h3 {
      padding-top: 15px;
      font-size: 1.25em;
      font-weight: bold;
      margin: 1em 0 0.5em;
      line-height: 1.25;
    }

    .item {
      padding: 0 15px;
      + .item {
        h4 {
          margin-top: 2em;
        }
      }
      h4 {
        font-weight: 700;
      }
    }
  }
  .footer {
    flex: 0 0 none;
    padding: 0 15px;
    .desc {
      padding-top: 10px;
      font-size: 13px;
      color: var(--color-primary-font);
      line-height: 1.25;

      p {
        font-size: 13px;
        color: var(--color-primary-font);
        line-height: 1.25;
      }
    }
  }
  .btns {
    display: flex;
    flex-flow: row nowrap;
    gap: 15px;
  }

  .btn {
    :global(button) {
      margin-top: 10px;
      display: block;
      width: 100%;
    }
  }
  .btn2 {
    :global(button) {
      margin-top: 10px;
      display: block;
      width: 50%;
    }
  }

  .log {
    margin: 6px 0;
    :global {
      h1,
      h2,
      h3,
      h4 {
        font-weight: bold;
        margin: 1em 0 0.5em;
        line-height: 1.25;
      }
      h1 {
        font-size: 1.5em;
      }
      h2 {
        font-size: 1.25em;
      }
      h3 {
        font-size: 1.1em;
      }
      p {
        font-size: 14px;
        line-height: 1.5;
        margin-bottom: 1em;
      }
      code {
        padding: 0.1em 0.4em;
        margin: 0;
        font-size: 85%;
        white-space: break-spaces;
        background-color: var(--color-primary-background);
        border: 1px solid var(--color-primary-background-hover);
        border-radius: 3px;
      }
      .mac code {
        font-family: 'SF Mono', monaco, menlo, courier, monospace;
      }
      .windows code {
        font-family: consolas, 'Courier New', monospace;
      }
      .linux code {
        font-family: 'Ubuntu Mono', 'Liberation Mono', 'DejaVu Sans Mono', 'Courier New', monospace;
      }

      ul {
        padding-left: 2em;
        list-style: disc;
        margin-top: 0;
        margin-bottom: 1em;
      }
      ol {
        padding-left: 2em;
        list-style: decimal;
        margin-top: 0;
        margin-bottom: 1em;
      }
      blockquote {
        margin: 0 0 1em;
        padding-left: 1em;
        border-left: 4px solid var(--color-primary-background-hover);
        color: var(--color-primary-font);
        font-style: italic;
      }
      li {
        + li {
          margin-top: 0.25em;
        }
      }
      em {
        font-style: italic;
      }
      strong {
        font-weight: bold;
      }
      img {
        max-width: 100%;
      }
    }
  }
</style>

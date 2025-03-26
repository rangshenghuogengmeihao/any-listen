<script lang="ts">
  import { useDownloadProgress, useIgnoreVersion, useVersionInfo } from '@/modules/version/reactive.svelte'
  import Modal from '@/components/material/Modal.svelte'
  import Btn from '@/components/base/Btn.svelte'
  import { compareVersions, sizeFormate } from '@/shared'
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

  const versionInfo = useVersionInfo()
  const downloadProgress = useDownloadProgress()
  const ignoreVersion = useIgnoreVersion()

  let disabledIgnoreFailBtn = $state(false)

  let history = $derived.by(() => {
    if (!versionInfo.val.newVersion?.history) return []
    let arr: AnyListen.VersionInfo[] = []
    let currentVer = versionInfo.val.version
    versionInfo.val.newVersion?.history.forEach((ver) => {
      if (compareVersions(currentVer, ver.version) < 0) arr.push(ver)
    })

    return arr
  })
  let progress = $derived(
    versionInfo.val.status == 'downloading'
      ? downloadProgress.val
        ? `${downloadProgress.val.percent.toFixed(2)}% - ${sizeFormate(downloadProgress.val.transferred)}/${sizeFormate(downloadProgress.val.total)} - ${sizeFormate(downloadProgress.val.bytesPerSecond)}/s`
        : '处理更新中...'
      : ''
  )
  let isIgnored = $derived(ignoreVersion.val == versionInfo.val.newVersion?.version)

  const handleOpenUrl = (url: string) => {
    void openUrl(url)
  }

  onMount(() => {
    disabledIgnoreFailBtn = isIgnoreFileTip()
  })
</script>

<Modal bind:visible={versionInfo.val.showModal} maxwidth="60%">
  {#if versionInfo.val.isLatest}
    <main class="version-modal-main">
      <h2>🎉 已是最新版本 🎉</h2>
      <div class="scroll select info">
        <div class="current">
          <h3>最新版本：{versionInfo.val.newVersion?.version}</h3>
          <h3>当前版本：{versionInfo.val.version}</h3>
          <h3>版本变化：</h3>
          <pre class="desc">{versionInfo.val.newVersion?.desc}</pre>
        </div>
      </div>
      <div class="footer">
        <div class="btns">
          {#if versionInfo.val.status == 'checking'}
            <Btn disabled>检查更新中...</Btn>
          {:else}
            <Btn onclick={checkUpdate}>重新检查更新</Btn>
          {/if}
        </div>
      </div>
    </main>
  {:else if versionInfo.val.isUnknown}
    <main class="version-modal-main">
      <h2>❓ 获取最新版本信息失败 ❓</h2>
      <div class="scroll select info">
        <div class="current">
          <h3>当前版本：{versionInfo.val.version}</h3>
          <div class="desc">
            <p>更新信息获取失败，可能是无法访问 GitHub 导致的，请手动检查更新！</p>
            <p>
              检查方法：打开
              <Btn
                min
                aria-label="点击打开"
                onclick={() => {
                  handleOpenUrl('https://github.com/lyswhut/lx-music-desktop/releases')
                }}>软件发布页</Btn
              >，查看「Latest」发布的<strong>版本号</strong>与当前版本({versionInfo.val.version})对比是否一致。
            </p>
            <p>若一致则不必理会该弹窗，直接关闭即可；否则请手动下载新版本更新。</p>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="btns">
          {#if versionInfo.val.status == 'error'}
            <Btn onclick={checkUpdate}>重新检查更新</Btn>
          {:else}
            <Btn disabled>检查更新中...</Btn>
          {/if}
          <Btn
            disabled={disabledIgnoreFailBtn}
            onclick={() => {
              ignoreFailTip()
              disabledIgnoreFailBtn = true
            }}>一个星期内不再提醒</Btn
          >
        </div>
      </div>
    </main>
  {:else if versionInfo.val.status == 'downloaded'}
    <main class="main">
      <h2>🚀程序更新🚀</h2>
      <div class="scroll select info">
        <div class="current">
          <h3>最新版本：{versionInfo.val.newVersion?.version}</h3>
          <h3>当前版本：{versionInfo.val.version}</h3>
          <h3>版本变化：</h3>
          <pre class="desc">{versionInfo.val.newVersion?.desc}</pre>
        </div>
        {#if history.length}
          <div class="history desc">
            <h3>历史版本：</h3>
            {#each history as ver (ver.version)}
              <div class="item">
                <h4>v{ver.version}</h4>
                <pre>{ver.desc}</pre>
              </div>
            {/each}
          </div>
        {/if}
      </div>
      <div class="footer">
        <div class="desc">
          <p>新版本已下载完毕，</p>
          <p>你可以选择<strong>立即重启更新</strong>或稍后<strong>关闭程序时</strong>自动更新~</p>
        </div>
        <div class="btns">
          <Btn onclick={restartUpdate}>立即重启更新</Btn>
        </div>
      </div>
    </main>
  {:else}
    <main class="main">
      <h2>🌟发现新版本🌟</h2>
      <div class="scroll select info">
        <div class="current">
          <h3>最新版本：{versionInfo.val.newVersion?.version}</h3>
          <h3>当前版本：{versionInfo.val.version}</h3>
          <h3>版本变化：</h3>
          <pre class="desc">{versionInfo.val.newVersion?.desc}</pre>
        </div>
        {#if history.length}
          <div class="history desc">
            <h3>历史版本：</h3>
            {#each history as ver (ver.version)}
              <div class="item">
                <h4>v{ver.version}</h4>
                <pre>{ver.desc}</pre>
              </div>
            {/each}
          </div>
        {/if}
      </div>
      <div class="footer">
        <div class="desc">
          <p>发现有新版本啦，你可以选择自动更新或手动更新。</p>
          <p>
            手动更新可以去&nbsp;
            <strong
              role="presentation"
              class="hover underline"
              aria-label="点击打开"
              onclick={() => {
                handleOpenUrl('https://github.com/lyswhut/lx-music-desktop/releases')
              }}
            >
              软件发布页
            </strong>
            下载。
          </p>
          <p>
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
          </p>
          {#if progress}
            <p>当前下载进度：{progress}</p>
          {:else}
            <p>&nbsp;</p>
          {/if}
        </div>
        <div class="btns">
          <Btn
            onclick={async () => {
              await saveIgnoreVersion(isIgnored ? (versionInfo.val.newVersion?.version ?? null) : null)
            }}>{isIgnored ? '取消忽略' : '忽略更新该版本'}</Btn
          >
          {#if versionInfo.val.status == 'downloading'}
            <Btn disabled>下载更新中...</Btn>
          {:else}
            <Btn onclick={downloadUpdate}>下载更新</Btn>
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
    min-width: 300px;
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

  .info {
    flex: 1 1 auto;
    font-size: 14px;
    line-height: 1.5;
    overflow-y: auto;
    height: 100%;
    padding: 0 15px;
  }
  .current {
    > p {
      padding-left: 15px;
    }
  }

  .desc {
    h3,
    h4 {
      font-weight: bold;
    }
    h3 {
      padding: 5px 0 3px;
    }
    ul {
      list-style: initial;
      padding-inline-start: 30px;
    }
    p {
      font-size: 14px;
      line-height: 1.5;
    }
  }

  .history {
    h3 {
      padding-top: 15px;
    }

    .item {
      h3 {
        padding: 5px 0 3px;
      }
      padding: 0 15px;
      + .item {
        padding-top: 15px;
      }
      h4 {
        font-weight: 700;
      }
      > p {
        padding-left: 15px;
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
    margin-top: 10px;
    display: block;
    width: 100%;
  }
  .btn2 {
    margin-top: 10px;
    display: block;
    width: 50%;
  }
</style>

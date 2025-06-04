<script lang="ts">
  import { updateSetting } from '@/modules/setting/store/action'
  import { t } from '@/plugins/i18n'
  import TitleContent from '../components/TitleContent.svelte'
  import Textarea from '@/components/base/Textarea.svelte'
  import { settingState } from '@/modules/setting/store/state'
  import Btn from '@/components/base/Btn.svelte'
  import defaultSetting from '@any-listen/common/defaultSetting'

  const formatVal = (v: string) => {
    return v.length ? `${v}\n` : v
  }
  let value = $state(formatVal(settingState.setting['extension.ghMirrorHosts']))
  const defVal = defaultSetting['extension.ghMirrorHosts']

  const handleSave = () => {
    let vals = value
      .trim()
      .split('\n')
      .map((v) => {
        v = v.trim().replace(/\/$/, '') // Remove trailing slashes
        if (!v) return ''
        if (v.startsWith('#') || v.includes(' ')) return ''
        if (v.startsWith('http://') || v.startsWith('https://')) {
          return v
        }
        return ''
      })
      .filter((v) => v !== '')

    vals = Array.from(new Set(vals)) // Remove duplicates

    const newVals = vals.join('\n')

    void updateSetting({
      'extension.ghMirrorHosts': newVals,
    })
    value = formatVal(newVals)
  }
</script>

<div class="settings-item">
  <TitleContent name={$t('settings.extension.gh_mirror_hosts')} desc={$t('settings.extension.gh_mirror_hosts_desc')}>
    <div class="settings-item-input">
      <div class="gap-top code">
        <Textarea
          id="settings.extension.gh_mirror_hosts"
          {value}
          onchange={(val) => {
            value = val
          }}
          onblur={handleSave}
        />
      </div>
      <div class="gap-top">
        <Btn
          min
          disabled={defVal == value.trim()}
          onclick={() => {
            value = formatVal(defVal)
            void updateSetting({
              'extension.ghMirrorHosts': defVal,
            })
          }}
        >
          {$t('settings.extension.gh_mirror_hosts_reset')}
        </Btn>
      </div>
    </div>
  </TitleContent>
</div>

<style lang="less">
  .settings-item-input {
    margin-left: 16px;

    :global {
      textarea {
        margin-top: 5px;
        max-width: 500px;
        width: 100%;
        min-height: 160px;
        min-width: 200px;
      }
    }
  }
</style>

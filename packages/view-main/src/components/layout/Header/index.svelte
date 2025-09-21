<script lang="ts">
  // import { useSettingValue } from '@/modules/setting/reactive.svelte'
  // import LeftControl from './LeftControl.svelte'
  import RightControl from './RightControl.svelte'
  // let controlBtnPosition = useSettingValue('common.controlBtnPosition')
</script>

<!-- {#if controlBtnPosition.val == 'left'}
  <LeftControl />
{:else} -->
<RightControl />
<!-- {/if} -->

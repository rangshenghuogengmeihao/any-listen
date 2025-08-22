<script lang="ts">
  import TogglePlayModeBtn from '@/components/common/TogglePlayModeBtn.svelte'
  import VolumeBtn from '@/components/common/VolumeBtn.svelte'
  import PlaylistBtn from '@/components/common/PlaylistBtn/index.svelte'
</script>

<div class="container">
  <PlaylistBtn />
  <VolumeBtn />
  <TogglePlayModeBtn />
</div>

<style lang="less">
  .container {
    display: flex;
    flex: none;
    flex-flow: row nowrap;
    gap: 15px;
  }
</style>

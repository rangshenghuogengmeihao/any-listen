<script lang="ts">
  import { t } from '@/plugins/i18n'
  let { label }: { label?: string } = $props()
</script>

<div class="noItem">
  <p>{label || $t('no_item')}</p>
</div>

<style lang="less">
  .noItem {
    flex: auto;
    height: 100%;
    position: relative;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    p {
      font-size: var(--font-size, 1.5rem);
      color: var(--color-font-label);
      margin-top: -10%;
    }
  }
</style>

<script lang="ts">
  import Tab from '@/components/base/Tab.svelte'
  import { i18n } from '@/plugins/i18n'
  import { viewResourceMap, viewTypes } from './shared'
  import { resourceList } from '@/modules/extension/reactive.svelte'

  let { activeview }: { activeview: (typeof viewTypes)[number] } = $props()
  const typeList = $derived.by(() => {
    const res = Object.keys($resourceList.resources)
    return viewTypes
      .filter((t) => {
        return viewResourceMap[t].some((r) => res.includes(r))
      })
      .map((t) => {
        return { id: t, href: `/online?type=${t}`, label: i18n.t(`online__type_${t}`) }
      })
  })
</script>

<header class="header">
  <Tab list={typeList} itemkey="id" itemlabel="label" value={activeview} tagname="a" href="href" />
  <div id="online-header-right"></div>
</header>

<style lang="less">
  .header {
    display: flex;
    flex: none;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    // padding: 8px 0;
    // background-color: var(--color-primary-light-400-alpha-800);
    // border-radius: @radius-border;

    // h2 {
    //   font-size: 18px;
    //   padding: 0 15px;
    // }
  }
</style>

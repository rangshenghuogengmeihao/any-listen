<script>
  import Logo from './Logo.svelte'
  import Nav from './Nav.svelte'
  import MyList from './MyList/index.svelte'
  // import { useSettingValue } from '@/modules/setting/reactive.svelte'
  // let controlBtnPosition = useSettingValue('common.controlBtnPosition')
  // export let params = {}

  // console.log(params)
</script>

<div class="aside">
  <!-- {#if controlBtnPosition.val == 'right'} -->
  <Logo />
  <!-- {/if} -->
  <Nav />
  <MyList />
</div>

<style lang="less">
  .aside {
    // background-color: var(--color-primary-light-900-alpha-900);
    display: flex;
    flex: none;
    flex-flow: column nowrap;
    width: 20%;
    max-width: 320px;
    // box-shadow: 0 0 5px rgba(0, 0, 0, .3);
    // transition: @transition-normal;
    // transition-property: background-color;
    // background-color: @color-theme-sidebar;
    // background-color: @color-aside-background;
    // border-right: 2px solid var(--color-primary);
    // -webkit-app-region: drag;
    // -webkit-user-select: none;
    background-color: var(--color-app-background);

    // &.fullscreen {
    //   // -webkit-app-region: no-drag;
    //   .logo {
    //     display: none;
    //   }
    // }
    // TODO: 兼容MAC
    // :global(.aside-logo + .aside-nav) {
    //   padding-top: 20px;
    // }
  }

  // :global(html.mac .aside-nav) {
  //   padding-top: env(titlebar-area-height, 30px);
  // }
</style>

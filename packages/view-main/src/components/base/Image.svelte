<script lang="ts">
  let {
    src,
    icon = 'night_landscape',
    width = '100%',
    height = '100%',
    loading = 'lazy',
    decoding = 'async',
  }: {
    src?: string | null
    icon?: string
    width?: number | string
    height?: number | string
    decoding?: 'async' | 'auto' | 'sync'
    loading?: 'lazy' | 'eager'
  } = $props()
  let isError = $state(false)

  $effect(() => {
    if (src) isError = false
  })
</script>

{#if src && !isError}
  <img
    {src}
    class="pic img"
    alt="PIC"
    style:width
    style:height
    {loading}
    {decoding}
    onerror={() => {
      isError = true
    }}
  />
{:else}
  <div style:width style:height class="pic empty-pic">
    <svg version="1.1" viewBox="0 0 192 192" width="78%">
      <use xlink:href={`#icon-${icon}`} />
    </svg>
  </div>
{/if}

<style lang="less">
  .img {
    // width: 100%;
    // height: 100%;
    object-fit: cover;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
    border-radius: @radius-border;
    aspect-ratio: 1;
  }
  .empty-pic {
    background-color: var(--color-primary-light-200-alpha-900);
    border-radius: @radius-border;
    // width: 100%;
    // height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-primary-light-400-alpha-400);
    user-select: none;
    // font-size: 20px;
    // font-family: Consolas, 'Courier New', monospace;
    border-radius: @radius-border;
    // letter-spacing: 3px;
    aspect-ratio: 1;
  }
</style>

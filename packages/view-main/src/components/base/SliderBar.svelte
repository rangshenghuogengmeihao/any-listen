<script lang="ts">
  import { onMount } from 'svelte'

  let {
    value,
    step,
    min,
    max,
    disabled = false,
    onchange,
  }: {
    value: number
    min: number
    max: number
    step?: number
    disabled?: boolean
    onchange: (val: number) => void
  } = $props()

  const sliderEvent = {
    isMsDown: false,
    msDownX: 0,
    msDownValue: 0,
  }
  let domSliderBar: HTMLElement

  const handleDown = (clientX: number, offsetX: number) => {
    // if (disabled) return
    sliderEvent.isMsDown = true
    sliderEvent.msDownX = clientX

    sliderEvent.msDownValue = offsetX / domSliderBar.clientWidth
    let val = sliderEvent.msDownValue * (max - min) + min
    if (val < min) val = min
    if (val > max) val = max
    onchange(val)

    // if (isMute.value) window.app_event.setSliderIsMute(false)
  }
  const handleSliderMsUp = () => {
    sliderEvent.isMsDown = false
  }
  const handleMove = (clientX: number) => {
    // if (!sliderEvent.isMsDown || disabled) return
    let value = (sliderEvent.msDownValue + (clientX - sliderEvent.msDownX) / domSliderBar.clientWidth) * (max - min) + min
    if (value > max) value = max
    else if (value < min) value = min
    onchange(value)
  }
  const handleWheel = (event: WheelEvent) => {
    const _step = step ?? (max - min) / 100
    let val = value - (event.deltaY / 100) * _step
    if (val < min) val = min
    if (val > max) val = max
    onchange(val)
  }
  const handleKeydown = (event: KeyboardEvent) => {
    let _step = step ?? (max - min) / 100
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        _step = -_step
      // eslint-disable-next-line no-fallthrough
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault()
        event.stopPropagation()
        break
      default:
        return
    }
    let val = value + _step
    if (val < min) val = min
    if (val > max) val = max
    onchange(val)
  }

  const handleMouseDown = (event: MouseEvent) => {
    if (disabled) return
    handleDown(event.clientX, event.offsetX)
  }
  const handleTouchDown = (event: TouchEvent) => {
    console.log('down')
    if (event.changedTouches.length) {
      if (disabled) return
      event.preventDefault()
      const touch = event.changedTouches[0]
      let offsetX = touch.clientX - (event.currentTarget as HTMLDivElement).getBoundingClientRect().left
      handleDown(touch.clientX, offsetX)
    }
  }
  const handleMouseMove = (event: MouseEvent) => {
    if (!sliderEvent.isMsDown || disabled) return
    handleMove(event.clientX)
  }
  const handleTouchMove = (event: TouchEvent) => {
    if (event.changedTouches.length) {
      if (!sliderEvent.isMsDown || disabled) return
      event.preventDefault()
      const touch = event.changedTouches[0]
      handleMove(touch.clientX)
    }
  }

  onMount(() => {
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleSliderMsUp)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleSliderMsUp)

    return () => {
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleSliderMsUp)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleSliderMsUp)
    }
  })
</script>

<div class="slider" class:disabled>
  <div class="slider-content">
    <div class="slider-bar" bind:this={domSliderBar} style:transform={`scaleX(${(value - min) / (max - min) || 0})`}></div>
  </div>
  <div
    class="slider-mask"
    role="slider"
    tabindex="0"
    aria-valuenow={value}
    aria-disabled={disabled}
    onwheel={handleWheel}
    onmousedown={handleMouseDown}
    ontouchstart={handleTouchDown}
    onkeydown={handleKeydown}
  ></div>
</div>

<style lang="less">
  .slider {
    position: relative;
    // margin-right: 10px;
    display: flex;
    flex: none;
    align-items: center;
    width: 100px;
    padding: 5px 0;
    opacity: 0.5;
    transition: opacity @transition-normal;
    &:hover {
      opacity: 1;
    }
    &.disabled {
      opacity: 0.3;
      .slider-mask {
        cursor: default;
      }
    }
  }

  .slider-content {
    // background-color: #f5f5f5;
    position: relative;
    // cursor: pointer;
    width: 100%;
    height: 5px;
    overflow: hidden;
    background-color: var(--color-primary-alpha-700);
    border-radius: 20px;
    transition: @transition-normal;
    transition-property: background-color, opacity;
    // border-radius: @radius-progress-border;
  }

  // .muted {
  //   opacity: .5;
  // }

  .slider-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--color-button-font);
    box-shadow: 0 0 2px rgb(0 0 0 / 20%);
    transform: scaleX(0);
    transform-origin: 0;
    transition-timing-function: ease;
    // border-radius: @radius-progress-border;
    transition-duration: 0.2s;
    transition-property: transform;
  }

  .slider-mask {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
</style>

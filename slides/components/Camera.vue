<script setup lang="ts">
import { slideHeight, slideWidth, useSlideContext } from '@slidev/client'
import { computed } from 'vue'

interface Shot {
  x: number
  y: number
  zoom: number
  rotate?: number
  duration?: number
}

const props = withDefaults(defineProps<{
  shots: Shot[]
  setWidth: number
  setHeight: number
  background?: string
}>(), {
  background: '#0b0b0c',
})

const { $clicks } = useSlideContext()

const currentShot = computed(() => {
  const index = Math.min(Math.max($clicks.value, 0), props.shots.length - 1)
  return props.shots[index]
})

// The set point (x, y) is placed at the centre of the frame, then the set is scaled around it.
const setStyle = computed(() => {
  const { x, y, zoom, rotate = 0, duration = 1.4 } = currentShot.value
  return {
    width: `${props.setWidth}px`,
    height: `${props.setHeight}px`,
    transform: `translate(${slideWidth.value / 2}px, ${slideHeight.value / 2}px) scale(${zoom}) rotate(${rotate}deg) translate(${-x}px, ${-y}px)`,
    transitionDuration: `${duration}s`,
  }
})
</script>

<template>
  <div class="camera" :style="{ background }">
    <div class="camera__set" :style="setStyle">
      <slot :clicks="$clicks" />
    </div>
  </div>
</template>

<style>
.camera {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.camera__set {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
  will-change: transform;
}
</style>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  left?: number
  top?: number
  width: number
  height: number
  wide?: boolean
}>(), { left: 60, top: 220, wide: false })

const px = (value: number) => `${value}px`
const centred = (width: number) => px(props.width / 2 - width / 2)

const rootStyle = computed(() => ({
  left: px(props.left),
  top: px(props.top),
  width: px(props.width),
  height: px(props.height),
}))
const lightWidth = computed(() => props.width * 0.575)
// In wide shots the top tilts back by 54° around its front edge: its far edge appears at height × (1 − cos 54°).
const tiltedTop = computed(() => props.height * 0.412)
</script>

<template>
  <!-- Wide shots: a high three-quarter view of a steel autopsy table. Close-ups: the top laid flat to read what is on it. -->
  <div class="autopsy-table" :class="{ 'autopsy-table--wide': wide }" :style="rootStyle">
    <div class="autopsy-table__light" :style="{ left: centred(lightWidth), width: px(lightWidth), top: px(tiltedTop - 730) }" />
    <svg class="autopsy-table__lamp" :style="{ left: centred(1000), top: px(tiltedTop - 1030) }" viewBox="0 0 1000 460" aria-hidden="true">
      <rect x="485" y="0" width="30" height="190" fill="#3f454b" />
      <ellipse cx="500" cy="300" rx="470" ry="120" fill="#565e66" />
      <ellipse cx="500" cy="285" rx="430" ry="95" fill="#2a2f34" />
      <ellipse cx="500" cy="300" rx="380" ry="70" fill="#fffbe8" />
      <ellipse cx="500" cy="300" rx="250" ry="42" fill="#ffffff" />
    </svg>

    <div class="autopsy-table__floor-shadow" :style="{ left: centred(width * 0.78), width: px(width * 0.78), top: px(height + 910) }" />
    <div class="autopsy-table__pedestal" :style="{ left: centred(710), top: px(height + 120) }" />
    <div class="autopsy-table__base" :style="{ left: centred(2150), top: px(height + 870) }" />
    <div class="autopsy-table__apron" :style="{ top: px(height) }" />

    <div class="autopsy-table__surface">
      <div class="autopsy-table__top" />
      <svg class="autopsy-table__tray" :style="{ top: px(height - 170) }" viewBox="0 0 560 300" aria-hidden="true">
        <rect x="6" y="6" width="548" height="288" rx="28" fill="#4b535b" stroke="#8a939b" stroke-width="10" />
        <path d="M70 90 L360 90 L430 104 L360 118 L70 118 Z" fill="#d6dbe0" />
        <rect x="40" y="86" width="120" height="36" rx="10" fill="#9aa3ab" />
        <path d="M60 190 L470 170 M60 220 L470 190" stroke="#c7cdd3" stroke-width="16" stroke-linecap="round" />
        <circle cx="70" cy="205" r="26" fill="none" stroke="#c7cdd3" stroke-width="12" />
      </svg>
      <slot />
    </div>

    <svg class="autopsy-table__toe-tag" :style="{ top: px(height + 80) }" viewBox="0 0 560 780" aria-hidden="true">
      <!-- Hung by its hole, so the tag falls along the string, slightly swung. -->
      <g transform="rotate(76 160 335)">
        <polygon points="160,230 510,230 510,440 160,440 110,385 110,285" fill="#e8d29b" />
        <circle cx="160" cy="335" r="20" fill="#0b0b0c" stroke="#c9a95c" stroke-width="9" />
        <text x="205" y="320" class="autopsy-table__toe-tag-case">Case</text>
        <text x="205" y="395" class="autopsy-table__toe-tag-number">#14000ms</text>
      </g>
      <path d="M150 0 C 140 110, 165 220, 160 305" stroke="#d6d3d1" stroke-width="7" fill="none" />
      <circle cx="160" cy="335" r="30" stroke="#d6d3d1" stroke-width="7" fill="none" />
    </svg>
  </div>
</template>

<style>
.autopsy-table {
  position: absolute;
  perspective: 6500px;
  perspective-origin: 50% -47%;
}

.autopsy-table__surface {
  position: absolute;
  inset: 0;
  transform-origin: 50% 100%;
  transition: transform 1.8s cubic-bezier(0.65, 0, 0.35, 1);
}

.autopsy-table--wide .autopsy-table__surface {
  transform: rotateX(54deg);
}

.autopsy-table__top {
  position: absolute;
  inset: 0;
  border-radius: 40px;
  background:
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.025) 0 3px, transparent 3px 11px),
    linear-gradient(180deg, #4b5259 0%, #30353a 55%, #23272b 100%);
  box-shadow: inset 0 0 0 10px #5d656d, inset 0 0 0 46px rgba(0, 0, 0, 0.18), 0 60px 120px rgba(0, 0, 0, 0.7);
}

/* A prop for the wide shots only: in close-ups it would intrude on the exhibits. */
.autopsy-table__tray {
  position: absolute;
  left: 120px;
  width: 300px;
  opacity: 0;
  transition: opacity 0.8s ease;
}

.autopsy-table--wide .autopsy-table__tray {
  opacity: 1;
}

.autopsy-table__apron {
  position: absolute;
  left: 0;
  right: 0;
  height: 120px;
  border-radius: 0 0 34px 34px;
  background: linear-gradient(180deg, #6b737b 0%, #3a4046 40%, #22262a 100%);
}

.autopsy-table__pedestal {
  position: absolute;
  width: 710px;
  height: 760px;
  background: linear-gradient(90deg, #22262a 0%, #5d656d 42%, #3a4046 70%, #1b1e21 100%);
}

.autopsy-table__base {
  position: absolute;
  width: 2150px;
  height: 130px;
  clip-path: polygon(14% 0, 86% 0, 100% 100%, 0 100%);
  background: linear-gradient(180deg, #5d656d 0%, #2a2f34 100%);
}

.autopsy-table__floor-shadow {
  position: absolute;
  height: 260px;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0) 70%);
}

.autopsy-table__lamp {
  position: absolute;
  width: 1000px;
}

.autopsy-table__light {
  position: absolute;
  height: 1480px;
  clip-path: polygon(41% 0, 59% 0, 100% 100%, 0 100%);
  background: linear-gradient(180deg, rgba(255, 251, 232, 0.16) 0%, rgba(255, 251, 232, 0.03) 100%);
  opacity: 0;
  transition: opacity 1.2s ease;
}

.autopsy-table--wide .autopsy-table__light {
  opacity: 1;
}

.autopsy-table__toe-tag {
  position: absolute;
  left: 360px;
  width: 560px;
}

.autopsy-table__toe-tag-case {
  font-family: 'Permanent Marker', cursive;
  font-size: 44px;
  fill: #7c2d12;
}

.autopsy-table__toe-tag-number {
  font-family: 'Permanent Marker', cursive;
  font-size: 54px;
  fill: #1c1917;
}
</style>

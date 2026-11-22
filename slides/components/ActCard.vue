<script setup lang="ts">
import { onSlideEnter, onSlideLeave } from '@slidev/client'
import { ref } from 'vue'

defineProps<{ act: string, title: string }>()

const framed = ref(false)

onSlideEnter(() => {
  framed.value = false
  requestAnimationFrame(() => requestAnimationFrame(() => (framed.value = true)))
})

onSlideLeave(() => (framed.value = false))

// The straight rules continue the two lines drawn inside each corner piece (same offsets, same corner size).
// An SVG stroke is centred on its path, a CSS border starts at its edge: shift by half the stroke to line up.
const CORNER = 90
const STROKE = 1.5
const RULE_OFFSETS = [4, 12]
const rules = RULE_OFFSETS.map(offset => `${offset - STROKE / 2}px`).flatMap(edge => [
  { top: edge, left: `${CORNER}px`, right: `${CORNER}px`, borderTopWidth: `${STROKE}px` },
  { bottom: edge, left: `${CORNER}px`, right: `${CORNER}px`, borderTopWidth: `${STROKE}px` },
  { left: edge, top: `${CORNER}px`, bottom: `${CORNER}px`, borderLeftWidth: `${STROKE}px` },
  { right: edge, top: `${CORNER}px`, bottom: `${CORNER}px`, borderLeftWidth: `${STROKE}px` },
])
const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
</script>

<template>
  <div class="act-card" :class="{ 'act-card--framed': framed }">
    <div class="act-card__frame">
      <!-- Silent-film intertitle: a double frame with scrolled corners, and a flourish between the act and its title. -->
      <div class="act-card__ornament" aria-hidden="true">
        <div v-for="(rule, index) in rules" :key="index" class="act-card__rule" :style="rule" />
        <svg
          v-for="corner in corners"
          :key="corner"
          class="act-card__corner"
          :class="`act-card__corner--${corner}`"
          viewBox="0 0 90 90"
        >
          <path d="M90 4 H30 C14 4 4 14 4 30 V90" />
          <path d="M90 12 H36 C22 12 12 22 12 36 V90" />
          <path d="M44 24 C32 24 24 32 24 44" />
          <path d="M34 34 C34 28 42 28 42 34 C42 42 30 42 30 34 C30 24 46 24 46 36" />
          <circle cx="56" cy="24" r="2" />
          <circle cx="24" cy="56" r="2" />
        </svg>
      </div>

      <div class="act-card__act">Act {{ act }}</div>
      <svg class="act-card__flourish" viewBox="0 0 360 36" aria-hidden="true">
        <path class="act-card__flourish-fill" d="M180 8 L190 18 L180 28 L170 18 Z" />
        <g v-for="side in ['left', 'right']" :key="side" :transform="side === 'right' ? 'translate(360 0) scale(-1 1)' : undefined">
          <path d="M162 18 H78" />
          <path d="M78 18 C60 18 54 7 63 4 C70 2 74 11 67 13" />
          <path d="M78 18 C60 18 54 29 63 32 C70 34 74 25 67 23" />
          <path d="M56 18 H14" />
          <circle class="act-card__flourish-fill" cx="10" cy="18" r="2.5" />
        </g>
      </svg>
      <div class="act-card__title">{{ title }}</div>
    </div>
  </div>
</template>

<style>
.act-card {
  --ornament: #a8a29e;
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, #1c1917 0%, #0c0a09 70%);
  overflow: hidden;
}

.act-card__frame {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  opacity: 0;
  transition: opacity 1.2s ease 0.2s;
}

.act-card--framed .act-card__frame {
  opacity: 1;
}

.act-card__ornament {
  position: absolute;
  inset: 40px 56px;
  pointer-events: none;
}

.act-card__rule {
  position: absolute;
  border: 0 solid var(--ornament);
}

.act-card__corner {
  position: absolute;
  width: 90px;
  height: 90px;
  fill: none;
  stroke: var(--ornament);
  stroke-width: 1.5;
  stroke-linecap: round;
}

.act-card__corner circle {
  fill: var(--ornament);
  stroke: none;
}

.act-card__corner--top-left {
  top: 0;
  left: 0;
}

.act-card__corner--top-right {
  top: 0;
  right: 0;
  transform: scaleX(-1);
}

.act-card__corner--bottom-left {
  bottom: 0;
  left: 0;
  transform: scaleY(-1);
}

.act-card__corner--bottom-right {
  bottom: 0;
  right: 0;
  transform: scale(-1, -1);
}

.act-card__act {
  font-family: 'Courier Prime', 'Courier New', Courier, monospace;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: #d6d3d1;
}

.act-card__title {
  font-family: 'Signika Negative', sans-serif;
  font-size: 3.4rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fafaf9;
}

.act-card__flourish {
  width: 22rem;
  margin: 3.2rem 0;
  fill: none;
  stroke: var(--ornament);
  stroke-width: 1.5;
  stroke-linecap: round;
}

.act-card__flourish-fill {
  fill: var(--ornament);
  stroke: none;
}
</style>

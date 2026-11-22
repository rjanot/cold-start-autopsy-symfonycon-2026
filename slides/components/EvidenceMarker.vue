<script setup lang="ts">
withDefaults(defineProps<{
  number: number
  lit?: boolean
  size?: string
  ruler?: boolean
}>(), {
  lit: true,
  size: '3.4rem',
  ruler: false,
})

const RULER_SEGMENTS = 8
const RULER_LEFT = 17
const RULER_WIDTH = 58
const segmentWidth = RULER_WIDTH / RULER_SEGMENTS
const ticks = Array.from({ length: RULER_SEGMENTS * 4 + 1 }, (_, i) => RULER_LEFT + i * segmentWidth / 4)
</script>

<template>
  <svg
    class="evidence-tent"
    :class="{ 'evidence-tent--lit': lit }"
    :style="{ width: size }"
    viewBox="0 0 84 60"
    role="img"
    :aria-label="`Evidence marker ${number}`"
  >
    <ellipse class="evidence-tent__shadow" cx="44" cy="56.5" rx="41" ry="3" />
    <polygon class="evidence-tent__back" points="14,5 3,46 10.72,46" />
    <polygon class="evidence-tent__front" points="14,5 76,5 80,55 10,55" />
    <line class="evidence-tent__ridge" x1="14" y1="5" x2="76" y2="5" />
    <text
      class="evidence-tent__number"
      :class="{ 'evidence-tent__number--with-ruler': ruler }"
      x="45.5"
      :y="ruler ? 40 : 44"
      text-anchor="middle"
    >{{ number }}</text>
    <g v-if="ruler" class="evidence-tent__ruler">
      <rect
        v-for="segment in RULER_SEGMENTS"
        :key="segment"
        :x="RULER_LEFT + (segment - 1) * segmentWidth"
        :y="segment % 2 ? 46 : 47.2"
        :width="segmentWidth"
        height="1.2"
      />
      <line :x1="RULER_LEFT" y1="48.4" :x2="RULER_LEFT + RULER_WIDTH" y2="48.4" />
      <line
        v-for="(x, i) in ticks"
        :key="i"
        :x1="x"
        y1="48.4"
        :x2="x"
        :y2="i % 4 ? 50 : 51.6"
      />
    </g>
  </svg>
</template>

<style>
.evidence-tent {
  display: block;
  height: auto;
  overflow: visible;
}

.evidence-tent__shadow {
  fill: rgba(0, 0, 0, 0.5);
}

.evidence-tent__back {
  fill: #2f3540;
  transition: fill 0.4s ease;
}

.evidence-tent__front {
  fill: #4b5563;
  stroke: #3b424e;
  stroke-width: 0.8;
  stroke-linejoin: round;
  transition: fill 0.4s ease, stroke 0.4s ease;
}

.evidence-tent__ridge {
  stroke: #6b7280;
  stroke-width: 1.2;
  stroke-linecap: round;
}

.evidence-tent__number {
  font-family: 'Arial Black', 'Helvetica Neue', Arial, sans-serif;
  font-size: 40px;
  font-weight: 900;
  fill: #9ca3af;
  transition: fill 0.4s ease;
}

.evidence-tent__number--with-ruler {
  font-size: 34px;
}

.evidence-tent__ruler rect {
  fill: #1f2937;
}

.evidence-tent__ruler line {
  stroke: #1f2937;
  stroke-width: 0.35;
}

.evidence-tent--lit .evidence-tent__back {
  fill: #b9a300;
}

.evidence-tent--lit .evidence-tent__front {
  fill: #f6e01c;
  stroke: #d2bb00;
}

.evidence-tent--lit .evidence-tent__ridge {
  stroke: #fff7a6;
}

.evidence-tent--lit .evidence-tent__number {
  fill: #141414;
}

.evidence-tent--lit .evidence-tent__ruler rect {
  fill: #141414;
}

.evidence-tent--lit .evidence-tent__ruler line {
  stroke: #141414;
}
</style>

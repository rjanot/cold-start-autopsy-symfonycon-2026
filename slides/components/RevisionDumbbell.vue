<script setup lang="ts">
// Median Cloud Run latency, one fresh revision per request, one night of measurements.
const rows = [
  { label: 'Feature flags', without: 3777, with: 4484, n: '74 / 75' },
  { label: 'Login', without: 5272, with: 5986, n: '60 / 75' },
  { label: 'GetInvestment', without: 7107, with: 7892, n: '63 / 75' },
  { label: 'Partner sync', without: 6830, with: 7903, n: '67 / 75' },
]

const plot = { left: 170, right: 740, top: 50, rowGap: 46 }
const domain = { min: 3000, max: 8500 }
const ticks = [3000, 4000, 5000, 6000, 7000, 8000]

function x(ms: number): number {
  return plot.left + (ms - domain.min) / (domain.max - domain.min) * (plot.right - plot.left)
}

function y(index: number): number {
  return plot.top + index * plot.rowGap
}

const axisY = plot.top + (rows.length - 1) * plot.rowGap + 30
const seconds = (ms: number) => (ms / 1000).toFixed(2)
const delta = (row: typeof rows[number]) => `+${((row.with - row.without) / 1000).toFixed(2)} s`
</script>

<template>
  <svg class="viz viz--dark dumbbell" viewBox="20 0 830 268" role="img" aria-label="Median Cloud Run latency without and with the pre-warmed file cache, four request types">
    <g class="viz__legend" transform="translate(170, 16)">
      <circle cx="0" cy="0" r="7" class="viz__mark--without" />
      <text x="14" y="6">Without file cache · env A</text>
      <circle cx="250" cy="0" r="7" class="viz__mark--with" />
      <text x="264" y="6">With the pre-warmed file cache · env B</text>
    </g>

    <g v-for="tick in ticks" :key="tick">
      <line :x1="x(tick)" :x2="x(tick)" :y1="plot.top - 18" :y2="axisY - 12" class="viz__grid" />
      <text :x="x(tick)" :y="axisY + 8" class="viz__tick" text-anchor="middle">{{ tick / 1000 }} s</text>
    </g>
    <line :x1="plot.left" :x2="plot.right" :y1="axisY - 12" :y2="axisY - 12" class="viz__axis" />

    <g v-for="(row, index) in rows" :key="row.label">
      <text :x="plot.left - 16" :y="y(index) + 6" class="viz__label" text-anchor="end">{{ row.label }}</text>
      <line :x1="x(row.without)" :x2="x(row.with)" :y1="y(index)" :y2="y(index)" class="viz__connector" />
      <circle :cx="x(row.without)" :cy="y(index)" r="8" class="viz__mark--without">
        <title>{{ row.label }} · without file cache · median {{ seconds(row.without) }} s</title>
      </circle>
      <circle :cx="x(row.with)" :cy="y(index)" r="8" class="viz__mark--with">
        <title>{{ row.label }} · with the pre-warmed file cache · median {{ seconds(row.with) }} s</title>
      </circle>
      <text :x="x(row.with) + 16" :y="y(index) + 6" class="viz__value">{{ delta(row) }}</text>
    </g>

    <text :x="plot.left" :y="axisY + 36" class="viz__caption">Median Cloud Run latency · fresh revision per request · n = 60–75 per case · each condition in its own environment</text>
  </svg>
</template>

<style>
/* Text sized for the back of the room: this chart is read from the slide, not from a screen. */
.viz.dumbbell .viz__legend text {
  font-size: 17px;
}

.viz.dumbbell .viz__label,
.viz.dumbbell .viz__value {
  font-size: 19px;
}

.viz.dumbbell .viz__tick {
  font-size: 15px;
}

.viz.dumbbell .viz__caption {
  font-size: 13px;
}
</style>

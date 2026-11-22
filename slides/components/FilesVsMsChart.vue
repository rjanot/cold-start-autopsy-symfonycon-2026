<script setup lang="ts">
withDefaults(defineProps<{ showFiles?: boolean }>(), { showFiles: true })

const revisions = [
  { fix: 'Dec 2025', files: null, ms: 14000, december: true },
  { fix: 'router fix', fix2: '+ insights', files: null, ms: 11420, december: true },
  { fix: '', files: 2568, ms: 6294 },
  { fix: 'fix insights', files: 1806, ms: 4423 },
  { fix: 'no-dev', files: 1234, ms: 3040 },
  { fix: 'terminate', files: 1234, ms: 2702 },
  { fix: 'firewall', files: 1156, ms: 2842 },
  { fix: 'exception', files: 1154, ms: 3242 },
  { fix: 'aliases', files: 1133, ms: 2508 },
  { fix: 'AI bundle', files: 1129, ms: 2331 },
  { fix: 'polyfills', files: 1116, ms: 2323 },
]
const SEPTEMBER = 2
const BIG_FIXES_END = 4

const x = (index: number) => 112 + index * 72
const msPanel = { top: 120, bottom: 242, min: 2000, max: 7000, ticks: [2000, 4000, 6000] }
const filesPanel = { top: 290, bottom: 412, min: 1000, max: 2700, ticks: [1000, 1500, 2000, 2500] }
// Values above the panel go to an off-scale band over it, still in order, labelled with ↑.
const OFF_SCALE_MAX = 15000
const OFF_SCALE_BAND = 34
const yFiles = (files: number) => filesPanel.bottom - (files - filesPanel.min) / (filesPanel.max - filesPanel.min) * (filesPanel.bottom - filesPanel.top)
const yMs = (ms: number) => ms > msPanel.max
  ? msPanel.top - 8 - (ms - msPanel.max) / (OFF_SCALE_MAX - msPanel.max) * OFF_SCALE_BAND
  : msPanel.bottom - (ms - msPanel.min) / (msPanel.max - msPanel.min) * (msPanel.bottom - msPanel.top)

const september = revisions.slice(SEPTEMBER)
const filesPath = september.map((r, i) => `${i ? 'L' : 'M'}${x(i + SEPTEMBER)} ${yFiles(r.files!)}`).join(' ')
const msPath = september.map((r, i) => `${i ? 'L' : 'M'}${x(i + SEPTEMBER)} ${yMs(r.ms)}`).join(' ')
const decemberPath = `M${x(0)} ${yMs(revisions[0].ms)} L${x(1)} ${yMs(revisions[1].ms)}`
const bridgePath = `M${x(1)} ${yMs(revisions[1].ms)} L${x(SEPTEMBER)} ${yMs(revisions[SEPTEMBER].ms)}`
const seconds = (ms: number) => `${(ms / 1000).toFixed(1)} s`
const thousands = (n: number) => n.toLocaleString('en-US')
const last = revisions.length - 1
const bigFixesDivider = (x(BIG_FIXES_END) + x(BIG_FIXES_END + 1)) / 2
const eraDivider = (x(1) + x(SEPTEMBER)) / 2
const labelledFiles = [SEPTEMBER, BIG_FIXES_END, last]
</script>

<template>
  <svg class="viz viz--dark files-ms" viewBox="0 0 900 470" role="img" aria-label="First request in production: 14 seconds in December 2025, then about 11.4 seconds once the router fix shipped together with GraphQL Insights, measured differently. September 2026, same request on nine versions: the median cold start falls from 6.3 to 3.0 seconds on the two big fixes, then moves between 2.3 and 3.2 seconds; the files compiled keep falling, from 2,568 to 1,116.">
    <text x="40" y="24" class="viz__label files-ms__title">Cold start · median PHP time · feature flags, same request · ≈ 230 cold starts per version</text>

    <rect :x="x(0) - 30" y="40" :width="eraDivider - x(0) + 30" :height="filesPanel.bottom - 34" class="files-ms__era" />
    <text :x="(x(0) + x(1)) / 2" y="56" class="viz__caption" text-anchor="middle">production</text>
    <text :x="(x(0) + x(1)) / 2" y="70" class="viz__caption files-ms__era-note" text-anchor="middle">first request, other instrument</text>

    <line :x1="bigFixesDivider" :x2="bigFixesDivider" y1="40" :y2="filesPanel.bottom + 6" class="files-ms__divider" />
    <text :x="bigFixesDivider - 10" y="56" class="viz__caption" text-anchor="end">two big fixes</text>
    <text :x="bigFixesDivider + 10" y="56" class="viz__caption">small fixes</text>

    <g v-for="tick in msPanel.ticks" :key="`m${tick}`">
      <line :x1="x(0) - 20" :x2="x(last) + 20" :y1="yMs(tick)" :y2="yMs(tick)" class="viz__grid" />
      <text :x="x(0) - 26" :y="yMs(tick) + 4" class="viz__tick" text-anchor="end">{{ tick / 1000 }} s</text>
    </g>
    <path :d="decemberPath" class="files-ms__line files-ms__line--ms files-ms__line--december" />
    <path :d="bridgePath" class="files-ms__line files-ms__line--bridge" />
    <path :d="msPath" class="files-ms__line files-ms__line--ms" />
    <circle
      v-for="(r, i) in revisions"
      :key="`md${i}`"
      :cx="x(i)"
      :cy="yMs(r.ms)"
      r="5"
      class="viz__dot"
      :class="r.december ? 'files-ms__dot--december' : 'files-ms__dot--ms'"
    >
      <title>{{ r.fix }} · {{ seconds(r.ms) }}</title>
    </circle>
    <text
      v-for="(r, i) in revisions"
      :key="`ml${i}`"
      :x="r.ms > msPanel.max && i === 0 ? x(i) + 10 : x(i)"
      :y="r.ms > msPanel.max ? (i === 0 ? yMs(r.ms) + 4 : yMs(r.ms) + 22) : yMs(r.ms) - 12"
      class="viz__value files-ms__ms-value"
      :text-anchor="r.ms > msPanel.max && i === 0 ? 'start' : 'middle'"
    >{{ r.ms > msPanel.max ? `≈ ${+(r.ms / 1000).toFixed(1)} s ↑` : r.december ? `≈ ${seconds(r.ms)}` : seconds(r.ms) }}</text>

    <g class="files-ms__files" :class="{ 'files-ms__files--hidden': !showFiles }">
      <text :x="eraDivider + 14" y="266" class="viz__label files-ms__title">Files compiled · same cold starts</text>
      <text :x="(x(0) + x(1)) / 2" :y="(filesPanel.top + filesPanel.bottom) / 2" class="viz__caption files-ms__era-note" text-anchor="middle">no file count yet</text>
      <g v-for="tick in filesPanel.ticks" :key="`f${tick}`">
        <line :x1="x(SEPTEMBER) - 20" :x2="x(last) + 20" :y1="yFiles(tick)" :y2="yFiles(tick)" class="viz__grid" />
        <text :x="x(SEPTEMBER) - 26" :y="yFiles(tick) + 4" class="viz__tick" text-anchor="end">{{ thousands(tick) }}</text>
      </g>
      <path :d="filesPath" class="files-ms__line files-ms__line--files" />
      <circle
        v-for="(r, i) in september"
        :key="`fd${i}`"
        :cx="x(i + SEPTEMBER)"
        :cy="yFiles(r.files!)"
        r="5"
        class="viz__dot files-ms__dot--files"
      >
        <title>{{ r.fix }} · {{ thousands(r.files!) }} files</title>
      </circle>
      <text
        v-for="i in labelledFiles"
        :key="`fl${i}`"
        :x="i === last ? x(i) + 6 : x(i)"
        :y="i === BIG_FIXES_END ? yFiles(revisions[i].files!) + 26 : yFiles(revisions[i].files!) - 12"
        class="viz__value"
        :text-anchor="i === last ? 'start' : 'middle'"
      >{{ thousands(revisions[i].files!) }}</text>
    </g>

    <g v-for="(r, i) in revisions" :key="`x${i}`">
      <text :x="x(i)" y="438" class="viz__caption" text-anchor="middle">{{ r.fix }}</text>
      <text v-if="r.fix2" :x="x(i)" y="453" class="viz__caption" text-anchor="middle">{{ r.fix2 }}</text>
    </g>
  </svg>
</template>

<style>
.viz.files-ms .files-ms__title {
  font-size: 16px;
  font-weight: 700;
}

.files-ms__line {
  fill: none;
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.files-ms__line--files {
  stroke: var(--series-without);
}

.files-ms__line--ms {
  stroke: var(--series-with);
}

.files-ms__dot--files {
  fill: var(--series-without);
}

.files-ms__dot--ms {
  fill: var(--series-with);
}

.files-ms__files {
  transition: opacity 0.8s ease;
}

.files-ms__files--hidden {
  opacity: 0;
}

.files-ms__divider {
  stroke: #52525b;
  stroke-width: 1;
  stroke-dasharray: 4 4;
}

.viz .files-ms__ms-value {
  font-size: 11px;
}

.files-ms__era {
  fill: rgba(255, 255, 255, 0.04);
  stroke: #3f3f46;
  stroke-dasharray: 3 3;
}

.viz .files-ms__era-note {
  font-size: 10px;
  fill: #a8a29e;
}

.files-ms__line--december {
  stroke-dasharray: 5 4;
}

.files-ms__line--bridge {
  stroke: #71717a;
  stroke-dasharray: 2 5;
}

.files-ms__dot--december {
  fill: #0b0b0c;
  stroke: var(--series-with);
  stroke-width: 2;
}
</style>

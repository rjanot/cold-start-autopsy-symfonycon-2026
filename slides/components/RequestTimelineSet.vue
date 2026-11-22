<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ clicks: number }>()

const TOTAL_MS = 14000
const ROUTER_MS = 10791
const BAR_LEFT = 200
const BAR_WIDTH = 3200

// Only the total and the RouterListener duration are sourced; the other segments share the rest evenly.
const otherMs = (TOTAL_MS - ROUTER_MS) / 5

const segments = computed(() => {
  const durations = [
    { name: 'front_controller', ms: otherMs },
    { name: 'kernel.request', ms: otherMs },
    { name: 'RouterListener', ms: ROUTER_MS, culprit: true },
    { name: 'firewall', ms: otherMs },
    { name: 'controller', ms: otherMs },
    { name: 'response', ms: otherMs },
  ]
  let left = BAR_LEFT
  return durations.map((segment) => {
    const width = BAR_WIDTH * segment.ms / TOTAL_MS
    const placed = { ...segment, left, width }
    left += width
    return placed
  })
})

const exposed = computed(() => props.clicks >= 2)
const evidenceShown = computed(() => props.clicks >= 1)
</script>

<template>
  <div class="timeline-set" :class="{ 'timeline-set--exposed': exposed }">
    <div class="timeline-set__header">
      <div class="timeline-set__request">POST /auth/login</div>
    </div>

    <div
      v-for="segment in segments"
      :key="segment.name"
      class="timeline-set__segment"
      :class="{ 'timeline-set__segment--culprit': segment.culprit }"
      :style="{ left: `${segment.left}px`, width: `${segment.width}px` }"
    >
      <span v-if="segment.culprit" class="timeline-set__culprit-name" :class="{ 'timeline-set__culprit-name--shown': evidenceShown }">{{ segment.name }}</span>
      <span v-else class="timeline-set__tag">{{ segment.name }}</span>
    </div>

    <div class="timeline-set__tick" :style="{ left: `${BAR_LEFT}px` }">0 s</div>
    <div class="timeline-set__tick" :style="{ left: `${BAR_LEFT + BAR_WIDTH}px` }">14 s</div>

    <div class="timeline-set__evidence" :class="{ 'timeline-set__evidence--shown': evidenceShown }">10,791 ms · 102 MB</div>
  </div>
</template>

<style>
.timeline-set {
  position: absolute;
  inset: 0;
  color: #e7e5e4;
  font-family: 'Fira Code', ui-monospace, monospace;
}

.timeline-set__header {
  position: absolute;
  left: 200px;
  top: 80px;
  text-align: left;
}

.timeline-set__request {
  font-size: 150px;
  font-weight: 700;
  line-height: 1;
}

.timeline-set__segment {
  position: absolute;
  top: 860px;
  height: 140px;
  background: #44403c;
  border-right: 4px solid #0b0b0c;
  transition: background 0.8s ease;
}

.timeline-set__segment--culprit {
  background: #57534e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-set--exposed .timeline-set__segment--culprit {
  background: #991b1b;
}

.timeline-set__culprit-name {
  font-size: 90px;
  font-weight: 700;
  color: #fafaf9;
  opacity: 0;
  transition: opacity 0.8s ease 0.6s;
}

.timeline-set__culprit-name--shown {
  opacity: 1;
}

.timeline-set__tag {
  position: absolute;
  left: 30px;
  bottom: 120px;
  font-size: 44px;
  white-space: nowrap;
  color: #d6d3d1;
  transform: rotate(-35deg);
  transform-origin: left bottom;
}

.timeline-set__tick {
  position: absolute;
  top: 1020px;
  font-size: 48px;
  color: #78716c;
  transform: translateX(-50%);
}

.timeline-set__evidence {
  position: absolute;
  left: 1726px;
  top: 1140px;
  padding: 16px 36px;
  font-size: 80px;
  font-weight: 700;
  white-space: nowrap;
  color: #a8a29e;
  border: 6px solid transparent;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.8s ease 0.8s, color 0.8s ease, border-color 0.8s ease, box-shadow 0.8s ease;
}

.timeline-set__evidence--shown {
  opacity: 1;
}

.timeline-set--exposed .timeline-set__evidence {
  color: #fecaca;
  border-color: #ef4444;
  box-shadow: 0 0 60px rgba(239, 68, 68, 0.55);
}
</style>

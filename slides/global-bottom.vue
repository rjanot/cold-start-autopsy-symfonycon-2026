<script setup lang="ts">
import { useNav } from '@slidev/client'
import { computed, onMounted, ref, watch } from 'vue'
import EvidenceMarker from './components/EvidenceMarker.vue'
import { ding, unlockAudioOnFirstGesture } from './utils/sfx'

const { slides, currentSlideNo, currentSlideRoute, clicks, isPresenter, isPrintMode } = useNav()


// `protocol` lights markers when the slide opens; `protocolClick` delays that to the click revealing the step.
const unlockedMarkers = computed(() => {
  let unlocked = 0
  for (const route of slides.value.slice(0, currentSlideNo.value)) {
    const frontmatter = route.meta?.slide?.frontmatter
    if (typeof frontmatter?.protocol !== 'number')
      continue
    const waitsForClick = route.no === currentSlideNo.value
      && typeof frontmatter.protocolClick === 'number'
      && clicks.value < frontmatter.protocolClick
    if (!waitsForClick)
      unlocked = frontmatter.protocol
  }
  return unlocked
})

// The markers only enter the story with the first protocol step.
const visible = computed(() => currentSlideRoute.value?.meta?.slide?.frontmatter?.markers !== false && unlockedMarkers.value >= 1)

const freshMarker = ref(0)
let freshTimer = 0

watch(unlockedMarkers, (now, before) => {
  if (now <= before)
    return
  freshMarker.value = now
  clearTimeout(freshTimer)
  freshTimer = window.setTimeout(() => freshMarker.value = 0, 1200)
  // The presenter window mirrors the slides: only the projected window may ring.
  if (!isPresenter.value && !isPrintMode.value)
    ding()
})

onMounted(unlockAudioOnFirstGesture)
</script>

<template>
  <div v-if="visible" class="evidence-markers" aria-label="Autopsy protocol progress">
    <span class="evidence-markers__label">Protocol</span>
    <div
      v-for="marker in 6"
      :key="marker"
      class="evidence-markers__slot"
      :class="{ 'evidence-markers__slot--fresh': marker === freshMarker }"
    >
      <EvidenceMarker :number="marker" :lit="marker <= unlockedMarkers" size="3.1rem" />
    </div>
  </div>
</template>

<style>
.evidence-markers {
  position: absolute;
  right: 1.25rem;
  bottom: 0.7rem;
  display: flex;
  align-items: flex-end;
  gap: 0.3rem;
  padding: 0.35rem 0.7rem 0.25rem;
  border-radius: 0.6rem;
  background: rgba(17, 17, 17, 0.88);
  z-index: 10;
}

.evidence-markers__label {
  align-self: center;
  margin-right: 0.35rem;
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #9ca3af;
}

.evidence-markers__slot {
  transform-origin: 50% 100%;
}

.evidence-markers__slot--fresh {
  animation: evidence-marker-drop 1.1s ease-out;
}

@keyframes evidence-marker-drop {
  0% { transform: translateY(-0.9rem) scale(1.35); }
  45% { transform: translateY(0) scale(1.15); }
  70% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
</style>

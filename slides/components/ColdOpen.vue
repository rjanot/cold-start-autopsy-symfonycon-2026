<script setup lang="ts">
import { onSlideLeave, useSlideContext } from '@slidev/client'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { flatline, monitorBeep, typewriterKey, unlockAudioOnFirstGesture } from '../utils/sfx'

const props = withDefaults(defineProps<{
  timeScale?: number
}>(), {
  timeScale: 1,
})

const CLOCK = '06:00'
const REQUEST = '→ POST /auth/login'
const ANSWERED_AT = 14
const FLATLINE_SECONDS = 2

const { $clicks, $renderContext } = useSlideContext()
const animated = computed(() => $renderContext.value === 'slide' || $renderContext.value === 'presenter')
// The presenter window renders the same slide: only the audience window may make noise.
const audible = computed(() => $renderContext.value === 'slide')

const clock = ref('')
const request = ref('')
const elapsed = ref(-1)
const dead = ref(false)
let flatlinePlayed = false

let timers: number[] = []
let frame = 0

function stopEverything(): void {
  timers.forEach(clearTimeout)
  timers = []
  cancelAnimationFrame(frame)
  frame = 0
}

function type(text: string, target: typeof clock, onDone?: () => void): void {
  target.value = ''
  let delay = 0
  for (const character of text) {
    delay += 70 + Math.random() * 45
    timers.push(window.setTimeout(() => {
      target.value += character
      if (audible.value)
        typewriterKey(character === ' ')
    }, delay))
  }
  if (onDone)
    timers.push(window.setTimeout(onDone, delay + 350))
}

function soundFlatline(): void {
  if (flatlinePlayed)
    return
  flatlinePlayed = true
  if (audible.value)
    flatline(FLATLINE_SECONDS)
}

function startWaiting(): void {
  const start = performance.now()
  let lastBeat = -1
  const tick = (now: number) => {
    elapsed.value = Math.min((now - start) / 1000 * props.timeScale, ANSWERED_AT)
    if (elapsed.value >= ANSWERED_AT) {
      soundFlatline()
      return
    }
    const beat = Math.floor(elapsed.value)
    if (beat !== lastBeat) {
      lastBeat = beat
      if (audible.value)
        monitorBeep()
    }
    frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
}

function showFinalState(clicks: number): void {
  clock.value = clicks >= 1 ? CLOCK : ''
  request.value = clicks >= 2 ? REQUEST : ''
  elapsed.value = clicks >= 2 ? ANSWERED_AT : -1
  dead.value = clicks >= 3
}

function play(clicks: number, previous: number | undefined): void {
  stopEverything()
  const steppedForward = previous !== undefined && clicks === previous + 1
  if (!animated.value || !steppedForward) {
    showFinalState(clicks)
    return
  }
  if (clicks === 1) {
    showFinalState(0)
    type(CLOCK, clock)
  }
  else if (clicks === 2) {
    showFinalState(1)
    flatlinePlayed = false
    type(REQUEST, request, startWaiting)
  }
  else if (clicks === 3) {
    showFinalState(3)
    soundFlatline()
  }
}

watch($clicks, (clicks, previous) => play(clicks, previous))
onMounted(() => {
  unlockAudioOnFirstGesture()
  showFinalState($clicks.value)
})
onSlideLeave(stopEverything)
onBeforeUnmount(stopEverything)

const milestone = computed(() => {
  const t = elapsed.value
  if (t >= ANSWERED_AT)
    return '14.0 s'
  if (t >= 10)
    return '10 s'
  if (t >= 5)
    return '5 s'
  if (t >= 1)
    return '1 s'
  return ''
})
const answered = computed(() => elapsed.value >= ANSWERED_AT)
const waiting = computed(() => elapsed.value >= 0 && elapsed.value < ANSWERED_AT && !dead.value)

const beats = Array.from({ length: 17 }, (_, i) => {
  const x = i * 100
  return `H${x + 40} L${x + 48} 8 L${x + 56} 52 L${x + 64} 30 H${x + 100}`
}).join(' ')
const heartbeatPath = `M0 30 ${beats}`
</script>

<template>
  <div class="h-full flex flex-col justify-center gap-8 px-16">
    <div class="cold-open__clock">{{ clock }}<span v-if="clock !== CLOCK && $clicks === 1" class="cold-open__cursor">▌</span></div>

    <div class="cold-open__log">{{ request }}</div>

    <div class="cold-open__stage">
      <div
        v-if="milestone"
        class="cold-open__counter"
        :class="{ 'cold-open__counter--dead': answered }"
      >
        {{ milestone }}
      </div>
      <div v-if="answered" class="cold-open__client mt-4"><span class="cold-open__client-mark">✕</span> client timed out — connection closed</div>
      <div v-if="answered" class="cold-open__status mt-2">← 200 OK</div>
    </div>

    <svg v-if="elapsed >= 0" class="flatline" viewBox="0 0 800 60" preserveAspectRatio="none">
      <g v-if="waiting" class="cold-open__heartbeat" :style="{ animationDuration: `${1 / props.timeScale}s` }">
        <path :d="heartbeatPath" />
      </g>
      <path v-else d="M0 30 H800" />
    </svg>

    <div class="cold-open__verdict" :class="{ 'cold-open__verdict--hidden': !dead }">
      The first request of the morning was found dead.
    </div>
  </div>
</template>

<style>
.cold-open__stage {
  min-height: 13rem;
}

.cold-open__client {
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 1.3rem;
  color: #9ca3af;
}

.cold-open__client-mark {
  color: #ef4444;
}

.cold-open__cursor {
  animation: cold-open-blink 0.8s steps(1) infinite;
}

.cold-open__heartbeat {
  animation-name: cold-open-scroll;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.cold-open__verdict--hidden {
  visibility: hidden;
}

@keyframes cold-open-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-100px); }
}

@keyframes cold-open-blink {
  50% { opacity: 0; }
}
</style>

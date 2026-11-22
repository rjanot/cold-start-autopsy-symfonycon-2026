<script setup lang="ts">
defineProps<{ clicks: number }>()

// Verbatim from our instrumented config/preload.php.
const lines = [
  { at: '+0 ms', message: 'probing /srv/backend/var/build/prod' },
  { at: '+1 ms', message: 'requiring App_KernelProdContainer.preload.php' },
  { at: '+151096 ms', message: 'loaded 7324 files, require took 151095 ms' },
]

// One true cold start with preload: 44.5 s in total, 1.3 s of PHP, the rest queued behind the preload.
const TOTAL_SECONDS = 44.5
const PROBE_GREEN_AT = 1
const PHP_SECONDS = 1.3
const percent = (seconds: number) => `${(seconds / TOTAL_SECONDS) * 100}%`
</script>

<template>
  <div class="preload-set">
    <div class="preload-set__terminal">
      <div class="preload-set__titlebar">
        <span class="preload-set__dot" /><span class="preload-set__dot" /><span class="preload-set__dot" />
        <span class="preload-set__title">preload.php — instrumented · PHP 8.5 · Cloud Run</span>
      </div>
      <div
        v-for="(line, index) in lines"
        :key="line.at"
        class="preload-set__line"
        :class="{ 'preload-set__line--hit': index === 2 && clicks >= 1 }"
      >
        <span class="preload-set__at">{{ line.at }}</span><span>{{ line.message }}</span>
      </div>
    </div>

    <div class="preload-set__timeline" :class="{ 'preload-set__timeline--shown': clicks >= 2 }">
      <div class="preload-set__timeline-title">One true cold start, with preload</div>
      <div class="preload-set__callouts">
        <div class="preload-set__callout preload-set__callout--start" style="left: 0">0 s · instance starts, preload starts compiling</div>
      </div>
      <div class="preload-set__bar">
        <div class="preload-set__segment preload-set__segment--boot" :style="{ width: percent(PROBE_GREEN_AT) }" />
        <div class="preload-set__segment preload-set__segment--queue" :style="{ width: percent(TOTAL_SECONDS - PROBE_GREEN_AT - PHP_SECONDS) }">
          the request waits — Apache is still compiling the preload (≈ 43 s)
        </div>
        <div class="preload-set__segment preload-set__segment--php" :style="{ width: percent(PHP_SECONDS) }" />
      </div>
      <div class="preload-set__ticks">
        <div class="preload-set__tick preload-set__tick--probe" :style="{ left: percent(PROBE_GREEN_AT) }">1 s · TCP probe green → Cloud Run: “ready”</div>
        <div class="preload-set__tick preload-set__tick--end" style="right: 0">44.5 s · of which PHP: 1.3 s</div>
      </div>
    </div>

    <div class="preload-set__verdict" :class="{ 'preload-set__verdict--shown': clicks >= 3 }">
      <div class="preload-set__big">44.5 s</div>
      <div class="preload-set__caption">Real cold start, with preload</div>
      <div class="preload-set__caption preload-set__caption--dim">without preload: 2.8 s</div>
      <div class="preload-set__ab">A/B in one environment, n = 50 each</div>
    </div>
  </div>
</template>

<style>
.preload-set {
  position: absolute;
  inset: 0;
  font-variant-ligatures: none;
}

.preload-set__terminal {
  position: absolute;
  left: 160px;
  top: 330px;
  width: 2300px;
  padding: 0 70px 70px;
  background: #111214;
  border: 3px solid #2a2e35;
  border-radius: 18px;
  box-shadow: 0 50px 120px rgba(0, 0, 0, 0.7);
  font-family: 'Fira Code', ui-monospace, monospace;
  text-align: left;
}

.preload-set__titlebar {
  display: flex;
  align-items: center;
  gap: 18px;
  margin: 0 -70px 40px;
  padding: 26px 40px;
  border-bottom: 2px solid #2a2e35;
}

.preload-set__dot {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #3f3f46;
}

.preload-set__title {
  margin-left: 24px;
  font-size: 36px;
  color: #a1a1aa;
}

.preload-set__line {
  padding: 12px 20px;
  font-size: 56px;
  line-height: 1.5;
  color: #d4d4d8;
  white-space: pre;
  transition: background 0.8s ease, color 0.8s ease;
}

.preload-set__at {
  display: inline-block;
  width: 400px;
  color: #71717a;
}

.preload-set__line--hit {
  background: rgba(239, 68, 68, 0.22);
  box-shadow: inset 10px 0 0 #ef4444;
  color: #fafaf9;
}

.preload-set__line--hit .preload-set__at {
  color: #fca5a5;
}

.preload-set__timeline {
  position: absolute;
  left: 160px;
  top: 1000px;
  width: 2440px;
  text-align: left;
  font-family: 'Signika Negative', sans-serif;
  opacity: 0;
  transition: opacity 1s ease 1s;
}

.preload-set__timeline--shown {
  opacity: 1;
}

.preload-set__timeline-title {
  font-size: 56px;
  font-weight: 700;
  color: #f5f5f4;
  margin-bottom: 28px;
}

.preload-set__callouts {
  position: relative;
  height: 90px;
}

.preload-set__callout {
  position: absolute;
  bottom: 0;
  height: 80px;
  padding-left: 16px;
  border-left: 4px solid #d6d3d1;
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 34px;
  white-space: nowrap;
  color: #e7e5e4;
}

.preload-set__bar {
  display: flex;
  height: 110px;
  border-radius: 12px;
  overflow: hidden;
}

.preload-set__segment {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  white-space: nowrap;
}

.preload-set__segment--boot {
  background: #52525b;
}

.preload-set__segment--queue {
  background: repeating-linear-gradient(135deg, #7f1d1d 0 28px, #991b1b 28px 56px);
  color: #fee2e2;
}

.preload-set__segment--php {
  background: #22c55e;
}

.preload-set__ticks {
  position: relative;
  height: 70px;
  margin-top: 0;
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 32px;
  line-height: 1.3;
  color: #a8a29e;
}

.preload-set__tick {
  position: absolute;
  top: 0;
  padding: 18px 0 0 14px;
  border-left: 4px solid #71717a;
  white-space: nowrap;
}

.preload-set__callout--start {
  border-left-color: #71717a;
  color: #a8a29e;
}

.preload-set__tick--probe {
  border-left-color: #d6d3d1;
  color: #e7e5e4;
}

.preload-set__tick--end {
  padding: 18px 14px 0 0;
  border-left: none;
  border-right: 4px solid #22c55e;
  text-align: right;
  color: #86efac;
}

.preload-set__verdict {
  position: absolute;
  left: 2620px;
  top: 300px;
  width: 900px;
  text-align: left;
  font-family: 'Signika Negative', sans-serif;
  opacity: 0;
  transition: opacity 1s ease 0.9s;
}

.preload-set__verdict--shown {
  opacity: 1;
}

.preload-set__big {
  font-size: 300px;
  font-weight: 700;
  line-height: 1;
  color: #f87171;
}

.preload-set__caption {
  margin-top: 30px;
  font-size: 64px;
  color: #f5f5f4;
}

.preload-set__caption--dim {
  margin-top: 10px;
  color: #a8a29e;
}

.preload-set__ab {
  margin-top: 60px;
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 38px;
  color: #a8a29e;
}
</style>

<script setup lang="ts">
const props = defineProps<{ clicks: number }>()

const AXIS_LEFT = 200
const AXIS_WIDTH = 4100
const AXIS_Y = 760

function xOf(dayOfYear: number): number {
  return AXIS_LEFT + dayOfYear / 365 * AXIS_WIDTH
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const monthStarts = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]

// Day of year 2025 (0 = 1 January): issue created, PR merged, tags, our investigation.
const ISSUE_DAY = 35
const OUR_VERSION_RELEASE_DAY = 148
const PR_MERGED_DAY = 228
const RELEASE_DAY = 240
const OUR_INVESTIGATION_DAY = 362

function focusedOn(shot: number): boolean {
  return props.clicks === shot
}

// Each milestone appears when the camera first reaches it, so the wide shot does not spoil the ending.
function reached(shot: number): boolean {
  return props.clicks >= shot
}
</script>

<template>
  <div class="upstream-set" :class="{ 'upstream-set--shelf': clicks >= 5 }">
    <div class="upstream-set__axis" :style="{ left: `${AXIS_LEFT}px`, width: `${AXIS_WIDTH}px`, top: `${AXIS_Y}px` }" />
    <div
      v-for="(month, index) in months"
      :key="month"
      class="upstream-set__month"
      :style="{ left: `${xOf(monthStarts[index])}px`, top: `${AXIS_Y + 24}px` }"
    >
      {{ month }}
    </div>
    <div class="upstream-set__year" :style="{ left: `${AXIS_LEFT}px`, top: `${AXIS_Y + 90}px` }">2025</div>

    <div class="upstream-set__pin" :class="{ 'upstream-set--hidden': !reached(1) }" :style="{ left: `${xOf(ISSUE_DAY)}px`, top: `${AXIS_Y - 140}px`, height: '140px' }" />
    <div class="upstream-set__card" :class="{ 'upstream-set__card--focused': focusedOn(1), 'upstream-set--hidden': !reached(1) }" style="left: 93px; top: 200px">
      <div class="upstream-set__kind">Issue #59703 · symfony/symfony</div>
      <div class="upstream-set__date">5 February 2025</div>
      <div class="upstream-set__title">[Router][Cache] Router cache does not warm using <code>cache:warm</code>, but does when <code>cache:clear</code></div>
      <div class="upstream-set__author">opened by <strong>kieljohn</strong></div>
    </div>

    <div class="upstream-set__pin upstream-set__pin--small" :class="{ 'upstream-set--hidden': !reached(4) }" :style="{ left: `${xOf(OUR_VERSION_RELEASE_DAY)}px`, top: `${AXIS_Y}px`, height: '60px' }" />
    <div class="upstream-set__note" :class="{ 'upstream-set--hidden': !reached(4) }" :style="{ left: `${xOf(OUR_VERSION_RELEASE_DAY)}px`, top: `${AXIS_Y + 90}px` }">
      v7.3.0 released — the one in our production
    </div>

    <div class="upstream-set__pin" :class="{ 'upstream-set--hidden': !reached(2) }" :style="{ left: `${xOf(PR_MERGED_DAY)}px`, top: `${AXIS_Y}px`, height: '200px' }" />
    <div class="upstream-set__card" :class="{ 'upstream-set__card--focused': focusedOn(2), 'upstream-set--hidden': !reached(2) }" style="left: 2261px; top: 960px">
      <div class="upstream-set__kind">Pull request #61115 · merged</div>
      <div class="upstream-set__date">17 August 2025</div>
      <div class="upstream-set__title">[FrameworkBundle] Make <code>cache:warmup</code> warm up read-only caches</div>
      <div class="upstream-set__author">by <strong>MatTheCat</strong></div>
    </div>

    <div class="upstream-set__pin" :class="{ 'upstream-set--hidden': !reached(3) }" :style="{ left: `${xOf(RELEASE_DAY)}px`, top: `${AXIS_Y - 140}px`, height: '140px' }" />
    <div class="upstream-set__card upstream-set__card--release" :class="{ 'upstream-set__card--focused': focusedOn(3), 'upstream-set--hidden': !reached(3) }" style="left: 1946px; top: 260px">
      <div class="upstream-set__kind">Released</div>
      <div class="upstream-set__date">29 August 2025</div>
      <div class="upstream-set__versions">v6.4.25 · v7.3.3</div>
    </div>

    <div class="upstream-set__pin upstream-set__pin--ours" :class="{ 'upstream-set--hidden': !reached(4) }" :style="{ left: `${xOf(OUR_INVESTIGATION_DAY)}px`, top: `${AXIS_Y}px`, height: '240px' }" />
    <div class="upstream-set__card upstream-set__card--ours" :class="{ 'upstream-set__card--focused': focusedOn(4), 'upstream-set--hidden': !reached(4) }" style="left: 3766px; top: 1000px">
      <div class="upstream-set__kind">Our investigation</div>
      <div class="upstream-set__date">29 December 2025</div>
      <div class="upstream-set__title">Production still on <code>symfony/framework-bundle</code> <strong>v7.3.0</strong></div>
    </div>

    <div class="upstream-set__shelf" :style="{ left: `${xOf(RELEASE_DAY)}px`, width: `${xOf(OUR_INVESTIGATION_DAY) - xOf(RELEASE_DAY)}px`, top: `${AXIS_Y - 70}px` }">
      <span>4 months on the shelf</span>
    </div>

    <div class="upstream-set__verdict">The cure had been on the shelf for four months.</div>
  </div>
</template>

<style>
.upstream-set {
  position: absolute;
  inset: 0;
  font-family: 'Signika Negative', sans-serif;
  color: #e7e5e4;
  text-align: left;
}

.upstream-set__axis {
  position: absolute;
  height: 8px;
  background: #57534e;
  border-radius: 4px;
}

.upstream-set__month {
  position: absolute;
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 40px;
  color: #78716c;
}

.upstream-set__year {
  position: absolute;
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 64px;
  font-weight: 700;
  color: #57534e;
}

.upstream-set__pin {
  position: absolute;
  width: 6px;
  margin-left: -3px;
  background: #a8a29e;
}

.upstream-set__pin--small {
  background: #57534e;
}

.upstream-set__pin--ours {
  background: #ef4444;
}

.upstream-set__note {
  position: absolute;
  transform: translateX(-50%);
  white-space: nowrap;
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 36px;
  color: #a8a29e;
}

.upstream-set__card {
  position: absolute;
  width: 1000px;
  padding: 36px 44px;
  background: #1c1b1a;
  border: 3px solid #3f3b38;
  border-radius: 18px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
  transition: border-color 0.8s ease, box-shadow 0.8s ease;
}

.upstream-set__card--focused {
  border-color: #facc15;
  box-shadow: 0 30px 110px rgba(250, 204, 21, 0.22);
}

.upstream-set__card--ours {
  border-color: #b91c1c;
}

.upstream-set__card--ours.upstream-set__card--focused {
  border-color: #ef4444;
  box-shadow: 0 30px 110px rgba(239, 68, 68, 0.35);
}

.upstream-set__kind {
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 34px;
  color: #a8a29e;
}

.upstream-set__date {
  margin-top: 10px;
  font-size: 58px;
  font-weight: 700;
  color: #fafaf9;
}

.upstream-set__title {
  margin-top: 18px;
  font-size: 46px;
  line-height: 1.3;
  color: #e7e5e4;
}

.upstream-set__title code,
.upstream-set__versions {
  font-family: 'Fira Code', ui-monospace, monospace;
}

.upstream-set__title code {
  white-space: nowrap;
  padding: 0 !important;
  background: transparent !important;
  font-size: 0.85em !important;
  color: #fde68a !important;
}

.upstream-set__card,
.upstream-set__pin,
.upstream-set__note {
  transition: opacity 0.9s ease 0.9s, border-color 0.8s ease, box-shadow 0.8s ease;
}

.upstream-set--hidden {
  opacity: 0;
}

.upstream-set__versions {
  margin-top: 14px;
  font-size: 60px;
  font-weight: 700;
  color: #86efac;
}

.upstream-set__card--ours .upstream-set__title strong {
  color: #fca5a5;
}

.upstream-set__author {
  margin-top: 18px;
  font-size: 40px;
  color: #a8a29e;
}

.upstream-set__author strong {
  color: #fafaf9;
}

.upstream-set__shelf {
  position: absolute;
  height: 40px;
  border: 6px solid #ef4444;
  border-bottom: none;
  opacity: 0;
  transition: opacity 0.8s ease 0.6s;
}

.upstream-set__shelf span {
  position: absolute;
  left: 50%;
  bottom: 60px;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 60px;
  font-weight: 700;
  color: #fca5a5;
}

.upstream-set__verdict {
  position: absolute;
  left: 0;
  right: 0;
  top: 1580px;
  text-align: center;
  font-size: 120px;
  font-weight: 700;
  color: #fafaf9;
  opacity: 0;
  transition: opacity 1s ease 1s;
}

.upstream-set--shelf .upstream-set__shelf,
.upstream-set--shelf .upstream-set__verdict {
  opacity: 1;
}
</style>

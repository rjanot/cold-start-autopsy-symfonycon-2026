<script setup lang="ts">
withDefaults(defineProps<{
  causeOfDeath?: string
  failedTreatments?: string
  contributingFactors?: string
  protocol?: number
  signed?: boolean
}>(), {
  causeOfDeath: '',
  failedTreatments: '',
  contributingFactors: '',
  protocol: 0,
  signed: false,
})
</script>

<template>
  <div class="autopsy-report">
    <div class="autopsy-report__title">
      Autopsy report — <span class="autopsy-report__case">Case #14000ms</span>
    </div>
    <dl>
      <div class="autopsy-report__row">
        <dt>Victim</dt><dd>first request of the morning</dd>
      </div>
      <div class="autopsy-report__row">
        <dt>Time of death</dt><dd>14 s</dd>
      </div>
      <div class="autopsy-report__row">
        <dt>Cause of death</dt><dd>{{ causeOfDeath }}</dd>
      </div>
      <div class="autopsy-report__row">
        <dt>Failed treatments</dt><dd>{{ failedTreatments }}</dd>
      </div>
      <div class="autopsy-report__row">
        <dt>Contributing factors</dt><dd>{{ contributingFactors }}</dd>
      </div>
      <div class="autopsy-report__row">
        <dt>Protocol</dt>
        <dd class="autopsy-report__protocol">
          <span v-for="step in 6" :key="step">{{ step }} {{ step <= protocol ? '☑' : '☐' }}</span>
        </dd>
      </div>
    </dl>
    <div class="autopsy-report__stamp" :class="{ 'autopsy-report__stamp--on': signed }">Case closed</div>
  </div>
</template>

<style>
.autopsy-report {
  position: relative;
  width: 58rem;
  margin: 0 auto;
  padding: 1.6rem 2rem 2.6rem;
  font-size: 1.3rem;
  background: #fffdf5;
  border: 1px solid #d6d3d1;
  box-shadow: 0 16px 35px rgba(0, 0, 0, 0.18);
  font-family: 'Fira Code', ui-monospace, monospace;
  color: #1f2937;
  text-align: left;
}

.autopsy-report__title {
  margin-bottom: 1rem;
  padding-bottom: 0.6rem;
  border-bottom: 2px solid #1f2937;
  font-family: 'Signika Negative', sans-serif;
  font-size: 1.7rem;
  font-weight: 700;
}

.autopsy-report__case {
  text-transform: uppercase;
}

.autopsy-report dl {
  margin: 0;
}

.autopsy-report__row {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  margin: 0.5rem 0;
}

.autopsy-report__row dt {
  flex: none;
  width: 12.6em;
  white-space: nowrap;
  color: #6b7280;
}

.autopsy-report__row dd {
  flex: 1;
  margin: 0;
  min-height: 1.4em;
  border-bottom: 1px dotted #9ca3af;
  font-family: 'Permanent Marker', cursive;
  color: #b91c1c;
}

.autopsy-report__protocol {
  display: flex;
  gap: 0.7rem;
  border-bottom: none !important;
  font-family: 'Fira Code', ui-monospace, monospace !important;
  color: #1f2937 !important;
}
.autopsy-report__stamp {
  position: absolute;
  right: 1.6rem;
  bottom: 1.4rem;
  padding: 0.2rem 0.9rem;
  border: 0.3rem solid #b91c1c;
  border-radius: 0.4rem;
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #b91c1c;
  opacity: 0;
  transform: rotate(-9deg) scale(1.6);
  transition: opacity 0.25s ease-in, transform 0.25s ease-in;
  mix-blend-mode: multiply;
}

.autopsy-report__stamp--on {
  opacity: 0.85;
  transform: rotate(-9deg) scale(1);
}
</style>

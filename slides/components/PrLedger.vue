<script setup lang="ts">
// Files: measured, the local bench in prod mode matched production.
// Milliseconds: rule of three on the ≈ −400 ms total — estimates only.
const changes = [
  { label: 'NoScalarOverridesListener', code: true, types: '48 → 11', files: '−76', ms: '−260 ms' },
  { label: 'Permission rules: a locator, not an iterator', code: false, types: '—', files: '−16', ms: '−55 ms' },
  { label: 'Gedmo metadata: a real cache pool', code: false, types: '—', files: '−24', ms: '−85 ms' },
]
</script>

<template>
  <div class="pr-split">
    <div class="pr-split__head" />
    <div class="pr-split__head">GraphQL types</div>
    <div class="pr-split__head pr-split__right">Files compiled</div>
    <div class="pr-split__head pr-split__right">Estimated time</div>

    <template v-for="(change, index) in changes" :key="change.label">
      <div class="pr-split__change">
        <code v-if="change.code">{{ change.label }}</code>
        <template v-else>{{ change.label }}</template>
      </div>
      <div
        class="pr-split__value"
        :class="change.types === '—' ? 'pr-split__value--dim' : 'pr-split__value--win'"
      >{{ change.types }}</div>
      <div class="pr-split__value pr-split__value--win pr-split__right">{{ change.files }}</div>
      <div class="pr-split__value pr-split__right">{{ change.ms }}</div>
    </template>

    <div class="pr-split__change pr-split__total">All three</div>
    <div class="pr-split__value pr-split__total" />
    <div class="pr-split__value pr-split__value--win pr-split__total pr-split__right">−116</div>
    <div class="pr-split__value pr-split__total pr-split__right">−400 ms</div>
  </div>
</template>

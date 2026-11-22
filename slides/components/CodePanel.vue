<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  file: string
  version: string
  firstLine: number
  code: string
  highlight: number[]
}>()

const lines = computed(() => props.code.replace(/\n$/, '').split('\n').map((text, offset) => {
  const number = props.firstLine + offset
  return {
    number,
    text,
    highlighted: props.highlight.includes(number),
    comment: /^\s*\/\*.*\*\/\s*$/.test(text),
  }
}))
</script>

<template>
  <div class="code-panel">
    <div class="code-panel__header">
      <span>{{ file }}</span>
      <span class="code-panel__version">{{ version }}</span>
    </div>
    <pre class="code-panel__code"><div
      v-for="line in lines"
      :key="line.number"
      class="code-panel__line"
      :class="{ 'code-panel__line--highlighted': line.highlighted, 'code-panel__line--comment': line.comment }"
    ><span class="code-panel__number">{{ line.number }}</span>{{ line.text }}</div></pre>
  </div>
</template>

<style>
.code-panel {
  border-radius: 0.6rem;
  border: 1px solid #2a2e35;
  background: #16181d;
  text-align: left;
  font-family: 'Fira Code', ui-monospace, monospace;
  font-variant-ligatures: none;
}

.code-panel__header {
  display: flex;
  justify-content: space-between;
  padding: 0.45rem 0.9rem;
  border-bottom: 1px solid #2a2e35;
  font-size: 0.75rem;
  color: #e4e4e7;
}

.code-panel__version {
  color: #a1a1aa;
}

.code-panel__code {
  margin: 0;
  padding: 0.4rem 0;
  background: transparent;
  font-size: 0.78rem;
  line-height: 1.55;
  color: #a1a1aa;
  white-space: pre;
}

.code-panel__line {
  padding-right: 0.9rem;
}

.code-panel__line--comment {
  color: #71717a;
}

.code-panel__line--highlighted {
  background: rgba(250, 204, 21, 0.12);
  box-shadow: inset 4px 0 0 #facc15;
  color: #fafaf9;
}

.code-panel__number {
  display: inline-block;
  width: 3.4rem;
  padding-right: 0.9rem;
  text-align: right;
  color: #52525b;
}
</style>

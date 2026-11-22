<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  file: string
  version?: string
  firstLine: number
  code: string
  highlight: number[]
  focused?: boolean
}>()

interface Token { text: string, kind: string }

const TOKEN_PATTERN = /(\/\/.*$)|('(?:[^'\\]|\\.)*')|(\$\w+)|\b(if|return|public|private|function|array|string|null|instanceof|new|throw|true|false)\b|->(\w+)/g

function tokenize(line: string): Token[] {
  const tokens: Token[] = []
  let cursor = 0
  for (const match of line.matchAll(TOKEN_PATTERN)) {
    const index = match.index ?? 0
    if (index > cursor)
      tokens.push({ text: line.slice(cursor, index), kind: 'plain' })
    if (match[1])
      tokens.push({ text: match[1], kind: 'comment' })
    else if (match[2])
      tokens.push({ text: match[2], kind: 'string' })
    else if (match[3])
      tokens.push({ text: match[3], kind: 'variable' })
    else if (match[4])
      tokens.push({ text: match[4], kind: 'keyword' })
    else if (match[5]) {
      tokens.push({ text: '->', kind: 'plain' })
      tokens.push({ text: match[5], kind: 'method' })
    }
    cursor = index + match[0].length
  }
  if (cursor < line.length)
    tokens.push({ text: line.slice(cursor), kind: 'plain' })
  return tokens
}

const lines = computed(() => props.code.replace(/\n$/, '').split('\n').map((text, offset) => {
  const number = props.firstLine + offset
  return { number, tokens: tokenize(text), highlighted: props.highlight.includes(number) }
}))
</script>

<template>
  <div class="code-exhibit" :class="{ 'code-exhibit--focused': focused }">
    <div class="code-exhibit__tag">{{ label }}</div>
    <div class="code-exhibit__header">
      <span class="code-exhibit__file">{{ file }}</span>
      <span v-if="version" class="code-exhibit__version">{{ version }}</span>
    </div>
    <pre class="code-exhibit__code"><div
      v-for="line in lines"
      :key="line.number"
      class="code-exhibit__line"
      :class="{ 'code-exhibit__line--highlighted': line.highlighted }"
    ><span class="code-exhibit__number">{{ line.number }}</span><span
      v-for="(token, index) in line.tokens"
      :key="index"
      :class="`code-exhibit__token--${token.kind}`"
    >{{ token.text }}</span></div></pre>
  </div>
</template>

<style>
.code-exhibit {
  position: absolute;
  font-variant-ligatures: none;
  font-feature-settings: 'liga' 0, 'calt' 0;
  padding: 0 0 36px;
  background: #16181d;
  border: 3px solid #2a2e35;
  border-radius: 14px;
  box-shadow: 0 40px 90px rgba(0, 0, 0, 0.6);
  color: #d4d4d8;
  text-align: left;
  transition: box-shadow 0.8s ease, border-color 0.8s ease;
}

.code-exhibit--focused {
  border-color: #facc15;
  box-shadow: 0 40px 120px rgba(250, 204, 21, 0.25);
}

.code-exhibit__tag {
  position: absolute;
  top: -70px;
  left: 40px;
  padding: 10px 34px;
  background: #facc15;
  color: #111;
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 56px;
  font-weight: 800;
  letter-spacing: 0.12em;
  transform: rotate(-2deg);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45);
}

.code-exhibit__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 40px;
  padding: 44px 48px 26px;
  border-bottom: 2px solid #2a2e35;
  font-family: 'Fira Code', ui-monospace, monospace;
}

.code-exhibit__file {
  font-size: 36px;
  font-weight: 700;
  color: #f4f4f5;
}

.code-exhibit__version {
  font-size: 30px;
  color: #a1a1aa;
}

.code-exhibit__code {
  margin: 0;
  padding: 26px 0 0;
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 32px;
  line-height: 1.6;
  white-space: pre;
  background: transparent;
}

.code-exhibit__line {
  padding: 0 48px 0 0;
}

.code-exhibit__line--highlighted {
  background: rgba(239, 68, 68, 0.22);
  box-shadow: inset 8px 0 0 #ef4444;
}

.code-exhibit__number {
  display: inline-block;
  width: 130px;
  padding-right: 34px;
  text-align: right;
  color: #52525b;
}

.code-exhibit__token--comment { color: #71717a; }
.code-exhibit__token--string { color: #fbbf24; }
.code-exhibit__token--variable { color: #7dd3fc; }
.code-exhibit__token--keyword { color: #f472b6; }
.code-exhibit__token--method { color: #86efac; }
</style>

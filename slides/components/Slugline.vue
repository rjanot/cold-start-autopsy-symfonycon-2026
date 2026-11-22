<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'

const { $frontmatter, $clicks } = useSlideContext()

const heading = computed(() => {
  const { act, scene } = $frontmatter
  return [act && `ACT ${act}`, scene && `SCENE ${scene}`].filter(Boolean).join(' · ')
})

// A list of slugs follows the clicks, one per click, the last one holding.
const slug = computed(() => {
  const { slug } = $frontmatter
  return Array.isArray(slug) ? slug[Math.min($clicks.value, slug.length - 1)] : slug
})
</script>

<template>
  <div class="slugline">
    <span v-if="heading" class="slugline__heading">{{ heading }}</span>
    <span v-if="slug" class="slugline__slug">{{ slug }}</span>
  </div>
</template>

<style>
/* Permanent and quiet, like a timecode: bottom left, facing the evidence markers. */
.slugline {
  position: absolute;
  left: 1.8rem;
  bottom: 1.25rem;
  z-index: 20;
  display: flex;
  align-items: baseline;
  gap: 0.9rem;
  font-family: 'Courier Prime', 'Courier New', Courier, monospace;
  text-align: left;
  pointer-events: none;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.95), 0 0 2px rgba(0, 0, 0, 0.9);
}

.slugline__heading {
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  color: #78716c;
}

.slugline__slug {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #a8a29e;
}
</style>

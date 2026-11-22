<script setup lang="ts">
const props = withDefaults(defineProps<{ versions?: string[] }>(), {
  versions: () => ['7.3', '7.4', '8.0', '8.1'],
})

// The first version is repeated at the end so the reel loops without a jump.
const reel = [...props.versions, props.versions[0]]
</script>

<template>
  <span class="version-roulette" :style="{ '--steps': versions.length }">
    <span class="version-roulette__window">
      <span class="version-roulette__reel">
        <span v-for="(version, index) in reel" :key="index" class="version-roulette__item">{{ version }}</span>
      </span>
    </span><span>.?</span>
  </span>
</template>

<style>
.version-roulette {
  display: inline-flex;
  align-items: flex-start;
}

.version-roulette__window {
  display: inline-block;
  height: 1em;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 7%, #000 93%, transparent 100%);
  mask-image: linear-gradient(180deg, transparent 0%, #000 7%, #000 93%, transparent 100%);
}

.version-roulette__reel {
  display: flex;
  flex-direction: column;
  animation: version-roulette-spin 4.8s cubic-bezier(0.7, 0, 0.3, 1) infinite;
}

.version-roulette__item {
  height: 1em;
  line-height: 1;
}

@keyframes version-roulette-spin {
  0%, 18% { transform: translateY(0); }
  25%, 43% { transform: translateY(-1em); }
  50%, 68% { transform: translateY(-2em); }
  75%, 93% { transform: translateY(-3em); }
  100% { transform: translateY(-4em); }
}
</style>

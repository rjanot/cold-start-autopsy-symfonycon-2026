<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <div class="coroner-badge">
    <div class="coroner-badge__slot" />
    <div class="coroner-badge__header">
      <span>Coroner</span>
      <span class="coroner-badge__name">{{ name }}</span>
    </div>
    <div class="coroner-badge__body">
      <img class="coroner-badge__photo" src="/coroner-photo.jpg" alt="">
      <div class="coroner-badge__fields">
        <slot />
      </div>
    </div>
    <div class="coroner-badge__gloss" />
  </div>
</template>

<style>
.coroner-badge {
  position: relative;
  width: 45rem;
  margin: 0 auto;
  border-radius: 1.2rem;
  background: #fbfaf7;
  color: #1c1917;
  border: 0.35rem solid #e7e5e4;
  box-shadow: 0 22px 45px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  transform: rotate(1.5deg);
  text-align: left;
}

.coroner-badge__slot {
  width: 5rem;
  height: 0.8rem;
  margin: 0.8rem auto 0;
  border-radius: 1rem;
  background: #d6d3d1;
}

.coroner-badge__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 0.8rem;
  padding: 0.6rem 1.6rem;
  background: #111827;
  color: #ffd60a;
  font-family: 'Fira Code', ui-monospace, monospace;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.95rem;
}

.coroner-badge__name {
  color: #f9fafb;
  letter-spacing: 0.08em;
  font-size: 1.25rem;
}

.coroner-badge__body {
  display: flex;
  gap: 1.6rem;
  padding: 1.4rem 1.6rem 1.6rem;
}

.coroner-badge__photo {
  flex: none;
  width: 8rem;
  height: 10.67rem;
  border-radius: 0.5rem;
  object-fit: cover;
  filter: grayscale(1) contrast(1.05);
  border: 1px solid #d6d3d1;
}

.coroner-badge__fields ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.coroner-badge__fields li {
  display: block;
  margin: 0 0 0.5rem;
  padding: 0;
  font-size: 1.15rem;
  line-height: 1.3;
}

.coroner-badge__fields li::before {
  content: none;
}

.coroner-badge__fields strong {
  display: block;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
}

.coroner-badge__gloss {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(115deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 38%, rgba(255, 255, 255, 0) 70%, rgba(255, 255, 255, 0.25) 100%);
}
</style>

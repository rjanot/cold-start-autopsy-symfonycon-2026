<script setup lang="ts">
const panels = ['Request / Response', 'Performance', 'Routing', 'Cache', 'Doctrine', 'Security']
</script>

<template>
  <div class="profiler-mock">
    <div class="profiler-mock__topbar">
      <span class="profiler-mock__brand">Symfony Profiler</span>
      <span class="profiler-mock__env">localhost · APP_ENV=dev</span>
    </div>
    <div class="profiler-mock__summary">
      <span class="profiler-mock__status">200</span>
      <span class="profiler-mock__request">POST /auth/login</span>
      <span class="profiler-mock__route">route <code>api_login</code></span>
    </div>
    <div class="profiler-mock__body">
      <ul class="profiler-mock__menu">
        <li v-for="panel in panels" :key="panel">
          <span>{{ panel }}</span><span class="profiler-mock__ok">✓</span>
        </li>
      </ul>
      <div class="profiler-mock__panel">
        <div class="profiler-mock__verdict">Nothing unusual.</div>
        <div class="profiler-mock__hint">Every panel is green.</div>
      </div>
    </div>
  </div>
</template>

<style>
.profiler-mock {
  width: 40rem;
  overflow: hidden;
  border-radius: 0.7rem;
  background: #ffffff;
  box-shadow: 0 1.4rem 3rem rgba(28, 25, 23, 0.22);
  text-align: left;
  font-family: 'Signika Negative', sans-serif;
  color: #1c1917;
}

.profiler-mock__topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.55rem 1rem;
  background: #18181b;
  color: #fafafa;
}

.profiler-mock__brand {
  font-weight: 700;
}

.profiler-mock__env {
  padding: 0.1rem 0.6rem;
  border-radius: 999px;
  background: #3f3f46;
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 0.75rem;
}

.profiler-mock__summary {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.6rem 1rem;
  border-bottom: 1px solid #e7e5e4;
}

.profiler-mock__status {
  padding: 0.1rem 0.6rem;
  border-radius: 0.3rem;
  background: #16a34a;
  color: #ffffff;
  font-family: 'Fira Code', ui-monospace, monospace;
  font-weight: 700;
}

.profiler-mock__request {
  font-family: 'Fira Code', ui-monospace, monospace;
  font-weight: 700;
}

.profiler-mock__route {
  color: #78716c;
}

.slidev-layout.film .profiler-mock__route code {
  background: #f5f5f4;
  color: #1c1917;
}

.profiler-mock__body {
  display: grid;
  grid-template-columns: 15rem 1fr;
}

.profiler-mock__menu {
  margin: 0;
  padding: 0.4rem 0;
  list-style: none !important;
  background: #f5f5f4;
  border-right: 1px solid #e7e5e4;
}

.profiler-mock__menu li {
  display: flex;
  justify-content: space-between;
  padding: 0.22rem 1rem;
  font-size: 0.9rem;
}

.profiler-mock__ok {
  color: #16a34a;
  font-weight: 700;
}

.profiler-mock__panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.5rem;
}

.profiler-mock__verdict {
  font-size: 1.8rem;
  font-weight: 700;
  color: #15803d;
}

.profiler-mock__hint {
  margin-top: 0.4rem;
  color: #78716c;
}
</style>

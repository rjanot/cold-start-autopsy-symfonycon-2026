<script setup lang="ts">
// Field names are the real `request_timeline` record; values from one cold request in September.
// "…" stands for fields that exist but are not discussed in the talk.
defineProps<{ focus?: 'none' | 'marks' | 'counters' | 'cacheGeneration' }>()
</script>

<template>
  <pre class="timeline-record" :class="`timeline-record--${focus ?? 'none'}`"><span class="tr-p">{</span>
  <span class="tr-k">"message"</span>: <span class="tr-s">"request.timeline"</span>,
<span class="tr-group tr-group--marks">  <span class="tr-k">"marks"</span>: [
    { <span class="tr-k">"name"</span>: <span class="tr-s">"front_controller"</span>,     <span class="tr-k">"atMs"</span>: <span class="tr-n">1.4</span>,   <span class="tr-k">"sincePreviousMs"</span>: <span class="tr-n">1.4</span> },
    { <span class="tr-k">"name"</span>: <span class="tr-s">"kernel.request.first"</span>, <span class="tr-k">"atMs"</span>: <span class="tr-n">9.6</span>,   <span class="tr-k">"sincePreviousMs"</span>: <span class="tr-n">8.1</span> },
    { <span class="tr-k">"name"</span>: <span class="tr-s">"kernel.request.last"</span>,  <span class="tr-k">"atMs"</span>: <span class="tr-n">521.7</span>, <span class="tr-k">"sincePreviousMs"</span>: <span class="tr-n">512.2</span> },
    <span class="tr-p">…</span> ],</span>
<span class="tr-group tr-group--counters">  <span class="tr-k">"compiled"</span>: { <span class="tr-k">"vendorOther"</span>: <span class="tr-n">841</span>, <span class="tr-k">"symfony"</span>: <span class="tr-n">416</span>, <span class="tr-k">"container"</span>: <span class="tr-n">398</span>, <span class="tr-k">"graphqlTypes"</span>: <span class="tr-n">324</span>, <span class="tr-p">…</span> },</span>
<span class="tr-group tr-group--counters tr-group--cache">  <span class="tr-k">"cacheGeneration"</span>: [],</span>
  <span class="tr-k">"db"</span>: { <span class="tr-k">"connectCount"</span>: <span class="tr-p">…</span>, <span class="tr-k">"connectMs"</span>: <span class="tr-p">…</span>, <span class="tr-k">"queryCount"</span>: <span class="tr-p">…</span>, <span class="tr-k">"queryMs"</span>: <span class="tr-p">…</span> },
<span class="tr-group tr-group--counters">  <span class="tr-k">"runtime"</span>: { <span class="tr-k">"processAgeS"</span>: <span class="tr-n">10</span>, <span class="tr-k">"opcacheHits"</span>: <span class="tr-p">…</span>, <span class="tr-k">"includedFiles"</span>: <span class="tr-n">2678</span>, <span class="tr-p">…</span> }</span>
<span class="tr-p">}</span></pre>
</template>

<style>
.timeline-record {
  margin: 0;
  padding: 1rem 1.3rem;
  border-radius: 0.6rem;
  border: 1px solid #2a2e35;
  background: #111214;
  font-family: 'Fira Code', ui-monospace, monospace;
  font-variant-ligatures: none;
  font-size: 0.72rem;
  line-height: 1.5;
  color: #a1a1aa;
  text-align: left;
  white-space: pre;
}

.tr-k { color: #7dd3fc; }
.tr-s { color: #fbbf24; }
.tr-n { color: #86efac; }
.tr-p { color: #71717a; }

.tr-group {
  display: inline;
  transition: opacity 0.6s ease, background 0.6s ease;
}

.timeline-record--marks .tr-group--counters,
.timeline-record--counters .tr-group--marks {
  opacity: 0.35;
}

.timeline-record--marks .tr-group--marks,
.timeline-record--counters .tr-group--counters {
  background: rgba(250, 204, 21, 0.12);
}

/* Everything fades except the one empty field. */
.timeline-record--cacheGeneration > :not(.tr-group--cache) {
  opacity: 0.25;
}

.timeline-record--cacheGeneration {
  color: rgba(161, 161, 170, 0.3);
}

.timeline-record--cacheGeneration .tr-group--cache,
.timeline-record--cacheGeneration .tr-group--cache * {
  color: inherit;
}

.timeline-record--cacheGeneration .tr-group--cache .tr-k {
  color: #7dd3fc;
}

.timeline-record--cacheGeneration .tr-group--cache {
  color: #fde68a;
  padding: 0.1rem 0.4rem;
  border-radius: 0.3rem;
  background: rgba(250, 204, 21, 0.22);
  box-shadow: 0 0 0 2px #facc15;
}
</style>

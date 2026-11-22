<script setup lang="ts">
defineProps<{ clicks: number }>()

// Laid out 2 × 2 in reading order. Clicks: 1–3 the silent bugs, 4–5 the lab report.

// Verbatim from php/php-src at tag php-8.5.12, ext/opcache/zend_file_cache.c, lines 1920-1933
// (one level of tab indentation removed, tabs rendered as four spaces).
const scriptLoad = `fd = zend_file_cache_open(filename, O_RDONLY | O_BINARY);
if (fd < 0) {
    efree(filename);
    return NULL;
}

if (zend_file_cache_flock(fd, LOCK_SH) != 0) {
    close(fd);
    efree(filename);
    return NULL;
}

if (read(fd, &info, sizeof(info)) != sizeof(info)) {
    zend_accel_error(ACCEL_LOG_WARNING, "opcache cannot read from file '%s' (info)\\n", filename);`
</script>

<template>
  <div class="bugs-set">
    <AutopsyTable :width="6030" :height="2600" :wide="clicks === 0">
    <div class="bugs-set__card" :class="{ 'bugs-set__card--focused': clicks === 1 }" style="left: 632px; top: 150px; width: 1750px; transform: rotate(-1.5deg)">
      <div class="bugs-set__tag">BUG 1 · TOO FRESH</div>
      <div class="bugs-set__row"><span class="bugs-set__time">08:21:51</span>cache:warmup writes its last files</div>
      <div class="bugs-set__row"><span class="bugs-set__time">08:21:52</span>the warm-up script starts</div>
      <div class="bugs-set__setting">opcache.file_update_protection = 2 s <span class="bugs-set__dim">(default)</span></div>
      <div class="bugs-set__result">745 of 934 GraphQL types<br>291 of 291 Doctrine proxies<br><span class="bugs-set__dim">compiled — never stored</span></div>
      <div class="bugs-set__build">21315 files compiled, 0 failed, 20278 entries</div>
    </div>

    <div class="bugs-set__card" :class="{ 'bugs-set__card--focused': clicks === 2 }" style="left: 3772px; top: 200px; width: 1500px; transform: rotate(1.5deg)">
      <div class="bugs-set__tag">BUG 2 · NOBODY MAY READ IT</div>
      <div class="bugs-set__row"><span class="bugs-set__perm">0600</span>entries</div>
      <div class="bugs-set__row"><span class="bugs-set__perm">0700</span>directories</div>
      <div class="bugs-set__row"><span class="bugs-set__perm">root</span>wrote them, at build time</div>
      <div class="bugs-set__row"><span class="bugs-set__perm">www-data</span>reads them: Apache</div>
      <div class="bugs-set__result">open() fails.<br><span class="bugs-set__dim">On every single entry.</span></div>
    </div>

    <CodeExhibit
      style="left: 392px; top: 1350px; width: 2230px; transform: rotate(-1deg)"
      label="EXHIBIT"
      file="ext/opcache/zend_file_cache.c"
      version="PHP 8.5.12"
      :first-line="1920"
      :code="scriptLoad"
      :highlight="[1921, 1922, 1923, 1924]"
      :focused="clicks === 3"
    />


      <div class="counters-set__report">
        <div class="counters-set__title">Lab report <span>· OPcache counters, cold instance</span></div>
        <div class="counters-set__context">The request includes ≈ 1,300 files.</div>
        <div class="counters-set__row">
          <div class="counters-set__label">First deploy</div>
          <div class="counters-set__ratio counters-set__ratio--bad">every file <span class="counters-set__ratio-unit">compiled</span></div>
          <div>
            <div class="counters-set__verdict">The cache was never read.</div>
          </div>
        </div>
        <div class="counters-set__row" :class="{ 'counters-set__row--hidden': clicks < 5 }">
          <div class="counters-set__label">After the two fixes</div>
          <div class="counters-set__ratio counters-set__ratio--good">16 files <span class="counters-set__ratio-unit">compiled</span></div>
          <div>
            <div class="counters-set__verdict">Now it is.</div>
          </div>
        </div>
      </div>
    </AutopsyTable>
  </div>
</template>

<style>
.bugs-set {
  position: absolute;
  inset: 0;
  font-variant-ligatures: none;
}

.bugs-set__card {
  position: absolute;
  padding: 120px 70px 70px;
  background: #16181d;
  border: 3px solid #2a2e35;
  border-radius: 14px;
  box-shadow: 0 40px 90px rgba(0, 0, 0, 0.6);
  color: #e4e4e7;
  text-align: left;
  font-family: 'Signika Negative', sans-serif;
  font-size: 58px;
  transition: box-shadow 0.8s ease, border-color 0.8s ease;
}

.bugs-set__card--focused {
  border-color: #facc15;
  box-shadow: 0 40px 120px rgba(250, 204, 21, 0.25);
}

.bugs-set__tag {
  position: absolute;
  top: -50px;
  left: 40px;
  padding: 10px 34px;
  background: #facc15;
  color: #111;
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 50px;
  font-weight: 800;
  letter-spacing: 0.08em;
  transform: rotate(-2deg);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45);
}

.bugs-set__row {
  margin-bottom: 18px;
}

.bugs-set__time,
.bugs-set__perm {
  display: inline-block;
  width: 330px;
  font-family: 'Fira Code', ui-monospace, monospace;
  color: #fde68a;
}

.bugs-set__setting {
  margin: 40px 0;
  padding: 20px 30px;
  border-left: 10px solid #facc15;
  background: rgba(250, 204, 21, 0.08);
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 50px;
}

.bugs-set__result {
  margin-top: 40px;
  font-size: 66px;
  font-weight: 700;
  line-height: 1.35;
  color: #fca5a5;
}

.bugs-set__dim {
  font-weight: 400;
  color: #a1a1aa;
}

.bugs-set__build {
  margin-top: 40px;
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 38px;
  color: #a1a1aa;
}

/* A lab report sheet on the table: results, next to the evidence they come from. */
.counters-set__report {
  position: absolute;
  left: 3400px;
  top: 1400px;
  width: 2250px;
  padding: 50px 70px 60px;
  border-radius: 6px;
  background: #fffdf5;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.55);
  font-family: 'Signika Negative', sans-serif;
  text-align: left;
  transform: rotate(1deg);
}

.counters-set__title {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 3px solid #1f2937;
  font-size: 56px;
  font-weight: 700;
  color: #1f2937;
}

.counters-set__title span {
  font-weight: 400;
  color: #6b7280;
}

.counters-set__context {
  font-size: 50px;
  color: #57534e;
}

.counters-set__row {
  display: grid;
  grid-template-columns: 480px 820px 1fr;
  align-items: center;
  gap: 40px;
  padding: 30px 0;
  transition: opacity 0.8s ease;
}

.counters-set__row + .counters-set__row {
  border-top: 2px solid #e7e5e4;
}

.counters-set__row--hidden {
  opacity: 0;
}

.counters-set__label {
  font-size: 50px;
  color: #57534e;
}

.counters-set__ratio {
  font-size: 100px;
  white-space: nowrap;
  font-weight: 700;
  line-height: 1;
}

.counters-set__ratio-unit {
  font-size: 64px;
  font-weight: 400;
}

.counters-set__ratio--bad {
  color: #b91c1c;
}

.counters-set__ratio--good {
  color: #15803d;
}

.counters-set__verdict {
  font-size: 54px;
  font-weight: 700;
  color: #44403c;
}
</style>

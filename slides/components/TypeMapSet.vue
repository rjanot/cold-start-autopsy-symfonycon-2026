<script setup lang="ts">
defineProps<{ clicks: number }>()

// Verbatim from our InsightsExecutorDecorator, before the fix; common indentation removed.
const decorator = `private function wrapResolvers(Schema $schema): array
{
    $originalResolvers = [];

    foreach ($schema->getTypeMap() as $type) {
        if (!$type instanceof HasFieldsType) {
            continue;
        }`

// Our .env.prod, before the fix.
const sampling = `GRAPHQL_INSIGHTS_SAMPLE_RATE=100`
</script>

<template>
  <div class="typemap-set">
    <AutopsyTable :width="3980" :height="1340" :wide="clicks === 0">
    <CodeExhibit
      style="left: 100px; top: 160px; width: 2050px; transform: rotate(-1.5deg)"
      label="EXHIBIT D"
      file="src/Infrastructure/Graphql/Insights/InsightsExecutorDecorator.php"
      :first-line="104"
      :code="decorator"
      :highlight="[108]"
      :focused="clicks === 1"
    />

    <CodeExhibit
      style="left: 2360px; top: 110px; width: 1500px; transform: rotate(1.5deg)"
      label="EXHIBIT E"
      file=".env.prod"
      :first-line="8"
      :code="sampling"
      :highlight="[8]"
      :focused="clicks === 2"
    />

    <div class="typemap-set__numbers" :class="{ 'typemap-set__numbers--shown': clicks >= 3 }">
      <div class="typemap-set__report-title">Lab report</div>
      <div class="typemap-set__row">
        <span class="typemap-set__label">GraphQL type classes compiled</span>
        <span class="typemap-set__value">324 → 13</span>
      </div>
      <div class="typemap-set__row">
        <span class="typemap-set__label">files compiled by the request</span>
        <span class="typemap-set__value">−710</span>
      </div>
      <div class="typemap-set__row">
        <span class="typemap-set__label">time gained (estimate)</span>
        <span class="typemap-set__value">≈ 1.8–2.8 s</span>
      </div>
    </div>
    </AutopsyTable>

  </div>
</template>

<style>
.typemap-set {
  position: absolute;
  inset: 0;
}

/* A lab report sheet laid on the table, next to the exhibits: results, not evidence. */
.typemap-set__numbers {
  position: absolute;
  left: 2360px;
  top: 480px;
  width: 1500px;
  padding: 40px 60px 50px;
  border-radius: 6px;
  background: #fffdf5;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.55);
  font-family: 'Signika Negative', sans-serif;
  text-align: left;
  transform: rotate(-1deg);
  opacity: 0;
  transition: opacity 0.8s ease 0.6s;
}

.typemap-set__report-title {
  padding-bottom: 20px;
  margin-bottom: 10px;
  border-bottom: 3px solid #1f2937;
  font-size: 56px;
  font-weight: 700;
  color: #1f2937;
}

.typemap-set__numbers--shown {
  opacity: 1;
}

.typemap-set__row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 40px;
  padding: 18px 0;
}

.typemap-set__row + .typemap-set__row {
  border-top: 2px solid #e7e5e4;
}

.typemap-set__label {
  font-size: 54px;
  color: #44403c;
}

.typemap-set__value {
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 96px;
  font-weight: 700;
  color: #15803d;
}
</style>

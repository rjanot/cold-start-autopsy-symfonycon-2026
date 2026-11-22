<script setup lang="ts">
defineProps<{ clicks: number }>()

// Verbatim from symfony/symfony at tag v7.3.0, common indentation removed.
const cacheWarmupCommand = `if (!$input->getOption('no-optional-warmers')) {
    $this->cacheWarmer->enableOptionalWarmers();
}
$cacheDir = $kernel->getContainer()->getParameter('kernel.cache_dir');

if ($kernel instanceof WarmableInterface) {
    $kernel->warmUp($cacheDir);
}

$preload = $this->cacheWarmer->warmUp($cacheDir);`

const routerCacheWarmer = `public function warmUp(string $cacheDir, ?string $buildDir = null): array
{
    if (!$buildDir) {
        return [];
    }`

const kernel = `if ($this->container->has('cache_warmer')) {
    $cacheWarmer = $this->container->get('cache_warmer');

    if ($cacheDir !== $buildDir) {
        $cacheWarmer->enableOptionalWarmers();
    }

    $preload = array_merge($preload, $cacheWarmer->warmUp($cacheDir, $buildDir));
}`
</script>

<template>
  <div class="exhibits-set" :class="{ 'exhibits-set--verdict': clicks >= 4 }">
    <AutopsyTable :width="5830" :height="1340" :wide="clicks === 0 || clicks >= 4">
      <CodeExhibit
        class="exhibits-set__exhibit"
        style="left: 140px; top: 200px; width: 1650px; transform: rotate(-2deg)"
        label="EXHIBIT A"
        file="FrameworkBundle/Command/CacheWarmupCommand.php"
        version="v7.3.0"
        :first-line="63"
        :code="cacheWarmupCommand"
        :highlight="[64, 72]"
        :focused="clicks === 1"
      />

      <CodeExhibit
        class="exhibits-set__exhibit"
        style="left: 1990px; top: 340px; width: 1700px; transform: rotate(1.5deg)"
        label="EXHIBIT B"
        file="FrameworkBundle/CacheWarmer/RouterCacheWarmer.php"
        version="v7.3.0"
        :first-line="37"
        :code="routerCacheWarmer"
        :highlight="[39, 40]"
        :focused="clicks === 2"
      />

      <CodeExhibit
        class="exhibits-set__exhibit"
        style="left: 3890px; top: 240px; width: 1800px; transform: rotate(-1deg)"
        label="EXHIBIT C"
        file="HttpKernel/Kernel.php"
        version="v7.3.0"
        :first-line="539"
        :code="kernel"
        :highlight="[542, 543, 544]"
        :focused="clicks === 3"
      />
    </AutopsyTable>

    <div class="exhibits-set__verdict">
      The warmer was there. It just never got the directory it was waiting for.
    </div>
  </div>
</template>

<style>
.exhibits-set {
  position: absolute;
  inset: 0;
}

.exhibits-set__exhibit {
  transform-origin: center;
}

.exhibits-set__verdict {
  position: absolute;
  left: 0;
  right: 0;
  top: 2600px;
  text-align: center;
  font-family: 'Signika Negative', sans-serif;
  font-size: 130px;
  font-weight: 700;
  color: #fafaf9;
  text-shadow: 0 6px 30px rgba(0, 0, 0, 0.8);
  opacity: 0;
  transition: opacity 1s ease 0.8s;
}

.exhibits-set--verdict .exhibits-set__verdict {
  opacity: 1;
}
</style>

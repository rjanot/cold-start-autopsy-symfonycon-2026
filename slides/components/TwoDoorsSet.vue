<script setup lang="ts">
defineProps<{ clicks: number }>()

// Verbatim from symfony/symfony 7.4, src/Symfony/Component/Security/Http/Authentication/AuthenticatorManager.php,
// lines 115-122 of supports(); common indentation removed.
const supports = `foreach ($this->authenticators as $authenticator) {
    $this->logger?->debug('Checking support on authenticator.', ['firewall_name' => $this->firewallName, 'authenticator' => $authenticator::class]);

    if (!$authenticator instanceof AuthenticatorInterface) {
        throw new \\InvalidArgumentException(\\sprintf('Authenticator "%s" must implement "%s".', get_debug_type($authenticator), AuthenticatorInterface::class));
    }

    if (false !== $supports = $authenticator->supports($request)) {`

// Numbered in request order: the firewall runs first, the terminate listener after the response.
// The cuts happened the other way round: path 2 first (no effect), then path 1.
const firewallPath = ['firewall', 'AuthenticatorManager::supports()', 'LoginLinkSuccessHandler', 'LastLoginRecorder', 'LoggerContextService']
const terminatePath = ['kernel.terminate', 'insights terminate listener']
</script>

<template>
  <div class="doors-set">
    <svg class="doors-set__wires" viewBox="0 0 5200 2100" preserveAspectRatio="none">
      <defs>
        <marker id="doors-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#71717a" />
        </marker>
      </defs>
      <line x1="510" y1="400" x2="580" y2="400" class="doors-set__wire" marker-end="url(#doors-arrow)" />
      <line x1="1570" y1="400" x2="1640" y2="400" class="doors-set__wire" marker-end="url(#doors-arrow)" />
      <line x1="2350" y1="400" x2="2420" y2="400" class="doors-set__wire" marker-end="url(#doors-arrow)" />
      <line x1="2970" y1="400" x2="3040" y2="400" class="doors-set__wire" marker-end="url(#doors-arrow)" />
      <line x1="3700" y1="400" x2="4030" y2="400" class="doors-set__wire" marker-end="url(#doors-arrow)" />
      <line x1="4066" y1="400" x2="4290" y2="400" class="doors-set__wire" :class="{ 'doors-set__wire--cut': clicks >= 3 }" marker-end="url(#doors-arrow)" />
      <line x1="710" y1="920" x2="790" y2="920" class="doors-set__wire" marker-end="url(#doors-arrow)" />
      <line x1="1620" y1="920" x2="4030" y2="920" class="doors-set__wire" marker-end="url(#doors-arrow)" />
      <line x1="4066" y1="920" x2="4290" y2="920" class="doors-set__wire" :class="{ 'doors-set__wire--cut': clicks >= 1 }" marker-end="url(#doors-arrow)" />
    </svg>

    <div class="doors-set__path-label" style="top: 230px">Path 1 · on every request, in the firewall</div>
    <div class="doors-set__node" style="left: 150px; top: 330px; width: 360px">{{ firewallPath[0] }}</div>
    <div class="doors-set__node doors-set__node--code" :class="{ 'doors-set__node--focused': clicks === 2 }" style="left: 590px; top: 330px; width: 980px">{{ firewallPath[1] }}</div>
    <div class="doors-set__node" style="left: 1650px; top: 330px; width: 700px">{{ firewallPath[2] }}</div>
    <div class="doors-set__node" style="left: 2430px; top: 330px; width: 540px">{{ firewallPath[3] }}</div>
    <div class="doors-set__node" style="left: 3050px; top: 330px; width: 650px">{{ firewallPath[4] }}</div>

    <div class="doors-set__path-label" style="top: 750px">Path 2 · after the response</div>
    <div class="doors-set__node" style="left: 150px; top: 850px; width: 560px">{{ terminatePath[0] }}</div>
    <div class="doors-set__node" style="left: 800px; top: 850px; width: 820px">{{ terminatePath[1] }}</div>

    <div class="doors-set__door" :class="{ 'doors-set__door--closed': clicks >= 3 }" style="top: 310px" />
    <div class="doors-set__door" :class="{ 'doors-set__door--closed': clicks >= 1 }" style="top: 830px" />

    <div class="doors-set__result doors-set__result--win" :class="{ 'doors-set__result--shown': clicks >= 3 }" style="top: 500px">
      path 1 cut · <strong>−81</strong> files <span class="doors-set__estimate">≈ 0.2–0.3 s (estimate)</span>
    </div>
    <div class="doors-set__result" :class="{ 'doors-set__result--shown': clicks >= 1 }" style="top: 1020px">
      path 2 cut · <strong>0</strong> files fewer
    </div>

    <div class="doors-set__target">
      <div class="doors-set__target-name">UserService</div>
      <div class="doors-set__target-deps">+ 16 dependencies</div>
      <div class="doors-set__deps">
        <span v-for="dependency in 16" :key="dependency" class="doors-set__dep" />
      </div>
    </div>

    <CodeExhibit
      style="left: 300px; top: 1250px; width: 3300px"
      label="EXHIBIT F"
      file="Security/Http/Authentication/AuthenticatorManager.php"
      version="Symfony 7.4"
      :first-line="115"
      :code="supports"
      :highlight="[115, 122]"
      :focused="clicks === 2"
    />
  </div>
</template>

<style>
.doors-set {
  position: absolute;
  inset: 0;
  font-family: 'Signika Negative', sans-serif;
  color: #e7e5e4;
  text-align: left;
}

.doors-set__wires {
  position: absolute;
  left: 0;
  top: 0;
  width: 5200px;
  height: 2100px;
}

.doors-set__wire {
  stroke: #71717a;
  stroke-width: 8;
  transition: stroke 0.6s ease, opacity 0.6s ease;
}

.doors-set__wire--cut {
  opacity: 0.15;
}

.doors-set__path-label {
  position: absolute;
  left: 150px;
  font-family: 'Signika Negative', sans-serif;
  font-size: 60px;
  font-weight: 700;
  color: #a8a29e;
}

.doors-set__node {
  position: absolute;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  border: 4px solid #3f3f46;
  background: #18181b;
  font-family: 'Fira Code', ui-monospace, monospace;
  font-variant-ligatures: none;
  font-size: 40px;
  color: #e4e4e7;
  white-space: nowrap;
  transition: border-color 0.6s ease;
}

.doors-set__node--code {
  color: #fde68a;
}

.doors-set__node--focused {
  border-color: #facc15;
}

.doors-set__door {
  position: absolute;
  left: 4030px;
  width: 36px;
  height: 180px;
  border-radius: 8px;
  background: #3f3f46;
  transition: background 0.6s ease, box-shadow 0.6s ease;
}

.doors-set__door--closed {
  background: #ef4444;
  box-shadow: 0 0 60px rgba(239, 68, 68, 0.6);
}

.doors-set__result {
  position: absolute;
  right: 1180px;
  font-size: 64px;
  color: #d6d3d1;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.6s ease 0.6s;
}

.doors-set__estimate {
  display: block;
  margin-top: 8px;
  text-align: right;
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 46px;
  color: #a8a29e;
}

.doors-set__result strong {
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 80px;
  color: #a8a29e;
}

.doors-set__result--win strong {
  color: #86efac;
}

.doors-set__result--shown {
  opacity: 1;
}

.doors-set__target {
  position: absolute;
  left: 4300px;
  top: 280px;
  width: 820px;
  height: 820px;
  padding: 60px;
  border-radius: 24px;
  border: 5px solid #facc15;
  background: rgba(250, 204, 21, 0.06);
  text-align: center;
}

.doors-set__target-name {
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 88px;
  font-weight: 700;
  color: #fde68a;
}

.doors-set__target-deps {
  margin-top: 20px;
  font-size: 56px;
  color: #d6d3d1;
}

.doors-set__deps {
  display: grid;
  grid-template-columns: repeat(4, 110px);
  gap: 30px;
  justify-content: center;
  margin-top: 60px;
}

.doors-set__dep {
  height: 70px;
  border-radius: 10px;
  background: #3f3f46;
}

</style>

<script setup lang="ts">
withDefaults(defineProps<{ revealed?: boolean }>(), { revealed: false })

// Generic silhouettes, not the official mascots: an elephant for PHP, a conductor for Composer,
// and the guilty one, a whale for the container image every file is fetched from.
const suspects = [
  { letter: 'A', range: '< 0.1 ms', guilty: false, kind: 'elephant' },
  { letter: 'B', range: '0.1 – 1 ms', guilty: false, kind: 'conductor' },
  { letter: 'C', range: '> 1 ms', guilty: true, kind: 'whale' },
]
const heights = ['7′', '6′6″', '6′', '5′6″', '5′', '4′6″', '4′', '3′6″']
</script>

<template>
  <div class="lineup" :class="{ 'lineup--revealed': revealed }">
    <div class="lineup__chart">
      <div v-for="(height, index) in heights" :key="height" class="lineup__line" :style="{ top: `${index * 12.5}%` }">
        <span>{{ height }}</span><span>{{ height }}</span>
      </div>
    </div>

    <div class="witness-call">Witness call</div>

    <div class="lineup__spotlight" />

    <div class="lineup__row">
      <div
        v-for="suspect in suspects"
        :key="suspect.letter"
        class="lineup__suspect"
        :class="{ 'lineup__suspect--guilty': suspect.guilty, 'lineup__suspect--cleared': !suspect.guilty }"
      >
        <svg v-if="suspect.kind === 'elephant'" class="lineup__silhouette" viewBox="0 0 200 300" aria-hidden="true">
          <path d="M22 200 C 10 204, 6 216, 12 222" stroke="#0d0f12" stroke-width="7" fill="none" stroke-linecap="round" />
          <ellipse cx="94" cy="206" rx="76" ry="56" />
          <rect x="34" y="232" width="30" height="44" rx="12" />
          <rect x="66" y="238" width="30" height="38" rx="12" />
          <rect x="104" y="238" width="30" height="38" rx="12" />
          <rect x="136" y="232" width="30" height="44" rx="12" />
          <circle cx="158" cy="168" r="42" />
          <path d="M190 178 C 206 196, 206 226, 190 242 C 182 250, 168 246, 172 236 C 184 224, 186 204, 176 192 Z" />
          <ellipse cx="134" cy="176" rx="30" ry="40" class="lineup__ear" />
          <circle cx="174" cy="158" r="4" class="lineup__eye" />
        </svg>
        <svg v-else-if="suspect.kind === 'conductor'" class="lineup__silhouette" viewBox="0 0 200 300" aria-hidden="true">
          <path d="M70 188 L 60 254 L 86 214 Z M122 188 L 132 254 L 106 214 Z" />
          <circle cx="96" cy="66" r="26" />
          <path d="M64 70 C 52 52, 62 30, 78 34 C 80 18, 100 14, 106 28 C 118 18, 136 30, 128 46 C 140 52, 136 72, 124 72 C 126 52, 108 44, 96 44 C 82 44, 68 52, 68 72 Z" class="lineup__hair" />
          <rect x="86" y="88" width="20" height="18" rx="6" />
          <path d="M66 114 C 70 104, 122 104, 128 114 L 132 196 L 118 248 L 104 210 L 90 210 L 76 248 L 62 196 Z" />
          <rect x="74" y="236" width="18" height="64" rx="6" />
          <rect x="102" y="236" width="18" height="64" rx="6" />
          <path d="M124 118 L 164 56 L 176 64 L 136 128 Z" />
          <path d="M70 118 L 32 62 L 20 70 L 58 128 Z" />
          <path d="M170 58 L 196 14" stroke="#e7e5e4" stroke-width="4" stroke-linecap="round" />
          <path d="M88 106 L 96 112 L 88 118 Z M104 106 L 96 112 L 104 118 Z" fill="#e7e5e4" />
        </svg>
        <svg v-else class="lineup__silhouette" viewBox="0 0 200 300" aria-hidden="true">
          <path d="M12 152 C 20 164, 26 182, 30 196 L 176 196 C 194 194, 202 212, 196 232 C 186 260, 150 272, 104 272 C 66 272, 42 262, 32 244 C 24 230, 14 220, 4 214 C -2 200, 2 172, 8 160 C 9 156, 10 152, 12 152 Z" />
          <g class="lineup__containers">
            <rect v-for="x in [42, 68, 94, 120, 146]" :key="`b${x}`" :x="x" y="170" width="22" height="22" />
            <rect v-for="x in [68, 94, 120]" :key="`m${x}`" :x="x" y="144" width="22" height="22" />
            <rect x="120" y="118" width="22" height="22" />
          </g>
          <circle cx="174" cy="214" r="5" class="lineup__eye" />
        </svg>
        <div class="lineup__placard">
          <div class="lineup__letter">{{ suspect.letter }}</div>
          <div class="lineup__range">{{ suspect.range }}</div>
          <div v-if="suspect.guilty" class="lineup__answer">~1.7 ms</div>
        </div>
      </div>
    </div>

    <div class="lineup__disclaimer">Any resemblance to PHP, Composer or Docker, living or dead, is purely coincidental.</div>
  </div>
</template>

<style>
.lineup {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: linear-gradient(180deg, #2a2f36 0%, #1d2126 75%, #121417 100%);
}

.lineup__chart {
  position: absolute;
  left: 0;
  right: 0;
  top: 110px;
  height: 360px;
}

.lineup__line {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  border-top: 2px solid rgba(255, 255, 255, 0.22);
  font-family: 'Courier Prime', 'Courier New', Courier, monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
}

.lineup__spotlight {
  position: absolute;
  left: 58%;
  top: 0;
  width: 34%;
  height: 100%;
  background: radial-gradient(ellipse 50% 70% at 50% 30%, rgba(255, 249, 225, 0.22) 0%, rgba(255, 249, 225, 0) 70%);
  opacity: 0;
  transition: opacity 0.8s ease;
}

.lineup--revealed .lineup__spotlight {
  opacity: 1;
}

.lineup__row {
  position: absolute;
  left: 10%;
  right: 10%;
  bottom: 74px;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
}

.lineup__suspect {
  position: relative;
  width: 190px;
  height: 320px;
  transform-origin: 50% 100%;
  transition: transform 0.9s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.8s ease, filter 0.8s ease;
}

.lineup__silhouette {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 230px;
  fill: #0d0f12;
  filter: drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.35));
}

.lineup__ear,
.lineup__hair {
  fill: #191c21;
}


.lineup__eye {
  fill: #3a3f47;
}

.lineup__containers rect {
  fill: #0d0f12;
  stroke: #4a515b;
  stroke-width: 2;
}

.lineup__placard {
  position: absolute;
  left: 50%;
  top: 236px;
  width: 168px;
  padding: 0.35rem 0.4rem 0.45rem;
  transform: translateX(-50%);
  background: #f5f5f4;
  border: 2px solid #1c1917;
  text-align: center;
  color: #1c1917;
}

.lineup__letter {
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
}

.lineup__range {
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 1.35rem;
  font-weight: 700;
  white-space: nowrap;
}

.lineup__answer {
  height: 0;
  overflow: hidden;
  font-family: 'Permanent Marker', cursive;
  font-size: 1.3rem;
  color: #b91c1c;
  transition: height 0.6s ease 0.5s;
}

.lineup--revealed .lineup__suspect--guilty {
  transform: translateY(10px) scale(1.1);
}

.lineup--revealed .lineup__suspect--guilty .lineup__answer {
  height: 1.7rem;
}

.lineup--revealed .lineup__suspect--cleared {
  opacity: 0.35;
  filter: grayscale(1);
}
.lineup__disclaimer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 1.25rem;
  text-align: center;
  font-family: 'Courier Prime', 'Courier New', Courier, monospace;
  font-size: 0.75rem;
  font-style: italic;
  letter-spacing: 0.06em;
  color: #78716c;
}
</style>

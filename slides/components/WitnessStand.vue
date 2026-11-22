<template>
  <div class="witness-stand">
    <div class="witness-stand__wainscot">
      <div v-for="panel in 7" :key="panel" class="witness-stand__panel" />
    </div>
    <div class="witness-stand__light" />

    <!-- The judge sits behind the bench; the witness box stays empty: the witness is the audience. -->
    <svg class="witness-stand__people" viewBox="0 0 1600 900" aria-hidden="true">
      <g class="witness-stand__judge">
        <path d="M170 640 C 176 580, 214 532, 262 522 L 338 522 C 386 532, 424 580, 430 640 Z" class="witness-stand__robe" />
        <path d="M286 524 L 300 600 L 314 524 Z" fill="#f1efe8" />
        <rect x="291" y="528" width="7" height="34" rx="2" fill="#f1efe8" />
        <rect x="302" y="528" width="7" height="34" rx="2" fill="#f1efe8" />
        <rect x="286" y="488" width="28" height="34" rx="8" class="witness-stand__skin" />
        <circle cx="300" cy="466" r="38" class="witness-stand__skin" />
        <path d="M252 474 C 246 420, 274 404, 300 404 C 326 404, 354 420, 348 474 C 340 448, 326 440, 300 440 C 274 440, 260 448, 252 474 Z" class="witness-stand__wig" />
        <g class="witness-stand__wig">
          <circle cx="252" cy="476" r="13" /><circle cx="248" cy="500" r="13" /><circle cx="250" cy="524" r="13" /><circle cx="254" cy="548" r="12" />
          <circle cx="348" cy="476" r="13" /><circle cx="352" cy="500" r="13" /><circle cx="350" cy="524" r="13" /><circle cx="346" cy="548" r="12" />
        </g>
        <g class="witness-stand__wig-shade">
          <path d="M240 476 a12 12 0 0 0 24 0 M236 500 a12 12 0 0 0 24 0 M238 524 a12 12 0 0 0 24 0" />
          <path d="M336 476 a12 12 0 0 0 24 0 M340 500 a12 12 0 0 0 24 0 M338 524 a12 12 0 0 0 24 0" />
        </g>
      </g>
    </svg>

    <div class="witness-stand__bench">
      <svg class="witness-stand__gavel" viewBox="0 0 120 60" aria-hidden="true">
        <rect x="56" y="22" width="60" height="9" rx="4" fill="#5a3b23" transform="rotate(-14 86 26)" />
        <rect x="18" y="6" width="44" height="30" rx="7" fill="#7a5233" stroke="#452e1c" stroke-width="3" transform="rotate(-14 40 21)" />
        <ellipse cx="34" cy="54" rx="26" ry="5" fill="#3d2a1b" />
      </svg>
      <div class="witness-stand__rail" />
      <div class="witness-stand__front">
        <div class="witness-stand__front-panel" />
        <div class="witness-stand__front-panel" />
      </div>
    </div>

    <div class="witness-call">Witness call</div>
    <div class="witness-stand__plaque">Witness</div>

    <div class="witness-stand__content">
      <div class="witness-stand__window">
        <slot name="exhibit" />
      </div>
      <div class="witness-stand__question">
        <slot name="question" />
      </div>
      <div class="witness-stand__oath">
        <svg class="witness-stand__hand" viewBox="0 0 64 80" aria-hidden="true">
          <path d="M20 78 C 10 70, 6 58, 6 46 L 6 34 C 6 30, 12 30, 12 34 L 12 44 L 14 44 L 14 12 C 14 7, 21 7, 21 12 L 21 40 L 23 40 L 23 6 C 23 1, 30 1, 30 6 L 30 40 L 32 40 L 32 9 C 32 4, 39 4, 39 9 L 39 42 L 41 42 L 41 17 C 41 12, 48 12, 48 17 L 48 52 C 48 66, 42 74, 36 78 Z" />
        </svg>
        <span><slot name="oath" /></span>
      </div>
    </div>

    <div class="witness-stand__box">
      <svg class="witness-stand__mic" viewBox="0 0 120 220" aria-hidden="true">
        <path d="M100 220 C 100 140, 40 120, 44 60" stroke="#1c1917" stroke-width="7" fill="none" />
        <rect x="30" y="18" width="28" height="48" rx="14" fill="#2a2a2a" stroke="#57534e" stroke-width="3" transform="rotate(-18 44 42)" />
      </svg>
      <div class="witness-stand__rail" />
      <div class="witness-stand__front">
        <div class="witness-stand__front-panel" />
        <div class="witness-stand__front-panel" />
        <div class="witness-stand__front-panel" />
      </div>
    </div>
  </div>
</template>

<style>
.witness-stand {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: linear-gradient(180deg, #1c1511 0%, #2b2019 55%, #1a130e 100%);
}

.witness-stand__wainscot {
  position: absolute;
  left: 0;
  right: 0;
  top: 60%;
  bottom: 0;
  display: flex;
  gap: 10px;
  padding: 14px 10px 0;
  border-top: 10px solid #5a3d27;
  background: #3a2819;
}

.witness-stand__panel {
  flex: 1;
  border-radius: 3px;
  background: linear-gradient(180deg, #4d3524 0%, #3f2b1c 100%);
  box-shadow: inset 0 0 0 5px #33231a, inset 3px 3px 0 6px rgba(255, 220, 170, 0.08), inset -3px -3px 0 6px rgba(0, 0, 0, 0.3);
}

.witness-stand__light {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 42% 60% at 50% 42%, rgba(255, 232, 190, 0.2) 0%, rgba(255, 232, 190, 0) 70%);
  pointer-events: none;
}

.witness-stand__plaque {
  position: absolute;
  top: 1.2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.25rem 1.4rem;
  border-radius: 0.2rem;
  background: linear-gradient(180deg, #e2bd5b 0%, #a37a27 100%);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.5);
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #2b1d0e;
}

.witness-stand__content {
  position: absolute;
  left: 0;
  right: 0;
  top: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  z-index: 1;
}

.witness-stand__window {
  padding: 0.6rem 2.4rem 0.8rem;
  border-radius: 0.8rem;
  border: 6px solid #b08a3a;
  background: radial-gradient(ellipse at 50% 30%, #1f1a17 0%, #0c0a09 100%);
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.9), 0 18px 40px rgba(0, 0, 0, 0.6);
}

.witness-stand__question {
  padding: 0.2rem 1rem;
  font-size: 1.35rem;
  font-weight: 700;
  color: #fafaf9;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
}

.witness-stand__oath {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: 'Courier Prime', 'Courier New', Courier, monospace;
  font-size: 1rem;
  letter-spacing: 0.08em;
  color: #fde68a;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
}

.witness-stand__hand {
  width: 1.6rem;
  fill: #fde68a;
}

.witness-stand__people {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  fill: #0e0a08;
  filter: drop-shadow(0 0 1.5px rgba(255, 226, 180, 0.35));
}

.witness-stand__robe,
.witness-stand__skin {
  fill: #0e0a08;
}

.witness-stand__wig {
  fill: #f1efe8;
}

.witness-stand__wig-shade {
  fill: none;
  stroke: #b9b4a8;
  stroke-width: 3;
}

.witness-stand__bench {
  position: absolute;
  left: 4%;
  width: 36%;
  bottom: 0;
  height: 190px;
  z-index: 2;
}

.witness-stand__bench .witness-stand__front {
  height: 168px;
}

.witness-stand__gavel {
  position: absolute;
  right: 8%;
  bottom: 174px;
  width: 64px;
}

.witness-stand__box {
  position: absolute;
  left: 60%;
  right: 4%;
  bottom: 0;
  height: 150px;
  z-index: 2;
}

.witness-stand__mic {
  position: absolute;
  left: 8%;
  bottom: 136px;
  width: 58px;
}

.witness-stand__rail {
  position: relative;
  z-index: 1;
  height: 22px;
  border-radius: 6px;
  background: linear-gradient(180deg, #c08a58 0%, #8a5d38 55%, #5a3b23 100%);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.7);
}

.witness-stand__front {
  display: flex;
  gap: 12px;
  height: 128px;
  margin: 0 12px;
  padding: 14px 12px 0;
  background: linear-gradient(180deg, #8a5f3c 0%, #6a472c 45%, #452e1c 100%);
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.6);
}

.witness-stand__front-panel {
  flex: 1;
  border-radius: 3px;
  background: linear-gradient(180deg, rgba(255, 220, 170, 0.08), rgba(0, 0, 0, 0.15));
  box-shadow: inset 0 0 0 4px #4a3020, inset 2px 2px 0 5px rgba(255, 220, 170, 0.14), inset -2px -2px 0 5px rgba(0, 0, 0, 0.35);
}
</style>

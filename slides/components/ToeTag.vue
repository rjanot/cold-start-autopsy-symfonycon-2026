<template>
  <div class="toe-tag">
    <div class="toe-tag__string" />
    <div class="toe-tag__card">
      <div class="toe-tag__hole" />
      <div class="toe-tag__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style>
.toe-tag {
  position: relative;
  display: inline-block;
  transform: rotate(-4deg);
  filter: drop-shadow(0 18px 30px rgba(0, 0, 0, 0.55));
}

.toe-tag__card {
  position: relative;
  width: 40rem;
  min-height: 15rem;
  padding: 2rem 2.5rem 2rem 6.5rem;
  display: flex;
  align-items: center;
  background: linear-gradient(160deg, #f3e3b8 0%, #e2c98b 100%);
  clip-path: polygon(11% 0, 100% 0, 100% 100%, 11% 100%, 0 72%, 0 28%);
  color: #2b2118;
  text-align: left;
}

.toe-tag__hole {
  position: absolute;
  left: 2.2rem;
  top: 50%;
  width: 1.8rem;
  height: 1.8rem;
  margin-top: -0.9rem;
  border-radius: 50%;
  background: #050505;
  box-shadow: 0 0 0 0.45rem #c9a95c;
}

.toe-tag__string {
  position: absolute;
  left: -9rem;
  top: 50%;
  width: 12.3rem;
  height: 0.18rem;
  background: #d6d3d1;
  transform: rotate(-12deg);
  transform-origin: right center;
}

.toe-tag__content p {
  margin: 0;
  line-height: 1.15;
}
</style>

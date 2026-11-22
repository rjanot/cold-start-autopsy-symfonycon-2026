import { chromium } from 'playwright-chromium'

const [base] = process.argv.slice(2)
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const errors = []

async function open(path) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  page.on('pageerror', e => errors.push(e.message))
  await page.addInitScript(() => {
    window.__osc = []
    const Original = window.AudioContext
    window.AudioContext = class extends Original {
      createOscillator() {
        const osc = super.createOscillator()
        const start = osc.start.bind(osc)
        const stop = osc.stop.bind(osc)
        const entry = { at: performance.now(), freq: () => osc.frequency.value }
        osc.start = (when) => { entry.startAt = when; return start(when) }
        osc.stop = (when) => { entry.stopAt = when; return stop(when) }
        window.__osc.push(entry)
        return osc
      }
    }
  })
  await page.goto(`${base}${path}`, { waitUntil: 'networkidle' })
  return page
}
const oscillators = page => page.evaluate(() => window.__osc.map(o => ({ t: Math.round(o.at), freq: Math.round(o.freq()), length: o.stopAt && o.startAt !== undefined ? +(o.stopAt - o.startAt).toFixed(2) : null })))

const cold = await open('/1')
await cold.keyboard.press('ArrowRight')
await cold.waitForTimeout(1000)
await cold.keyboard.press('ArrowRight')
const t0 = await cold.evaluate(() => performance.now())
await cold.waitForTimeout(19000)
const coldOsc = (await oscillators(cold)).filter(o => o.t >= t0)
const longTones = coldOsc.filter(o => o.length && o.length > 1)
const beeps = coldOsc.filter(o => o.freq === 780 && o.length && o.length < 1)
console.log('beeps', beeps.length, 'last beep at +', beeps.length ? ((beeps.at(-1).t - t0) / 1000).toFixed(1) : '-', 's')
console.log('long tones', longTones.map(o => ({ at: ((o.t - t0) / 1000).toFixed(1), length: o.length })))
const before = (await oscillators(cold)).length
await cold.keyboard.press('ArrowRight')
await cold.waitForTimeout(800)
console.log('oscillators added by click 3:', (await oscillators(cold)).length - before)

for (const [path, presses] of [['/14', 1], ['/17', 3]]) {
  const page = await open(path)
  for (let i = 1; i <= presses; i++) {
    const n = (await oscillators(page)).length
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(700)
    const added = (await oscillators(page)).slice(n)
    const lit = await page.locator('.evidence-marker--unlocked').count()
    console.log(`${path} click ${i}: +${added.length} tones ${JSON.stringify(added.map(o => o.freq))}, markers lit ${lit}`)
  }
}
console.log('errors', errors)
await browser.close()

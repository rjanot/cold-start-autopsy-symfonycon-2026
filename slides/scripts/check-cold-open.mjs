import { chromium } from 'playwright-chromium'

const [url, outDir] = process.argv.slice(2)
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
const errors = []
page.on('pageerror', e => errors.push(e.message))
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
await page.addInitScript(() => {
  window.__sfx = { contexts: 0, oscillators: 0, sources: 0 }
  const Original = window.AudioContext
  window.AudioContext = class extends Original {
    constructor(...args) { super(...args); window.__sfx.contexts++; window.__sfx.last = this }
    createOscillator() { window.__sfx.oscillators++; return super.createOscillator() }
    createBufferSource() { window.__sfx.sources++; return super.createBufferSource() }
  }
})
await page.goto(url, { waitUntil: 'networkidle' })
const shot = name => page.screenshot({ path: `${outDir}/${name}.png` })
const sfx = () => page.evaluate(() => ({ contexts: window.__sfx.contexts, oscillators: window.__sfx.oscillators, noiseBursts: window.__sfx.sources, state: window.__sfx.last?.state }))
const text = () => page.evaluate(() => document.querySelector('.cold-open__stage')?.innerText.replace(/\s+/g, ' ').trim())

await shot('0-start')
await page.keyboard.press('ArrowRight')
await page.waitForTimeout(1000)
await shot('1-clock')
console.log('click 1', await sfx())

await page.keyboard.press('ArrowRight')
const t0 = Date.now()
const at = async (seconds, name) => {
  await page.waitForTimeout(Math.max(0, t0 + seconds * 1000 - Date.now()))
  await shot(name)
  console.log(`t=${seconds}s stage="${await text()}"`, await sfx())
}
await at(3.4, '2-one-second')
await at(7.4, '3-five-seconds')
await at(12.4, '4-ten-seconds')
await at(17, '5-answered')
await page.keyboard.press('ArrowRight')
await page.waitForTimeout(800)
await shot('6-dead')
console.log('click 3', await sfx())
console.log('errors', errors)
await browser.close()

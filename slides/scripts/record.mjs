import { chromium } from 'playwright-chromium'
import { mkdirSync, renameSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const [url, outDir, outName] = process.argv.slice(2)
const steps = [2500, 3000, 3500, 4000, 3500, 3500, 3500, 2500]

mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
})
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: outDir, size: { width: 1280, height: 720 } },
})
const page = await context.newPage()
await page.goto(url, { waitUntil: 'networkidle' })
for (const wait of steps) {
  await page.waitForTimeout(wait)
  await page.keyboard.press('ArrowRight')
}
await page.waitForTimeout(1500)
const video = page.video()
await context.close()
await browser.close()
renameSync(await video.path(), join(outDir, outName))
console.log(readdirSync(outDir))

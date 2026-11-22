import { writeFileSync } from 'node:fs'
import { renderSVG } from 'uqr'

const codes = {
  'public/vasco-hiring-qr.svg': 'https://www.linkedin.com/in/rjanot/',
  'public/talk-repo-qr.svg': 'https://github.com/rjanot/cold-start-autopsy-symfonycon-2026',
}

for (const [file, url] of Object.entries(codes)) {
  writeFileSync(file, renderSVG(url, { ecc: 'M', border: 2, pixelSize: 10, whiteColor: '#ffffff', blackColor: '#000000' }))
  console.log(file, '→', url)
}

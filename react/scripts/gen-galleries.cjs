/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')

function listImages(dir) {
  if (!fs.existsSync(dir)) return []
  const exts = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'])
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && exts.has(path.extname(d.name).toLowerCase()))
    .map((d) => `/dev-img/ReVisit/${encodeURIComponent(d.name)}`)
    .sort((a, b) => a.localeCompare(b, 'fr'))
}

const root = path.resolve(__dirname, '..')
const pubDir = path.join(root, 'public', 'dev-img', 'ReVisit')
const outFile = path.join(pubDir, 'manifest.json')

try {
  const images = listImages(pubDir)
  const payload = { images }
  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2))
  console.log(`[gen-galleries] Wrote ${images.length} images to`, path.relative(root, outFile))
} catch (e) {
  console.error('[gen-galleries] Failed:', e)
  process.exit(0)
}


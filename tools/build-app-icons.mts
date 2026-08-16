/**
 * Rasterises the initials mark into the icon sizes that cannot take an SVG.
 *
 * The mark in app/icon.svg covers browsers that accept SVG favicons, but two surfaces will not:
 * Apple's touch icon must be a PNG, and the install prompt wants 192 and 512 PNGs in the manifest.
 * A site that leaves those out does not go without an icon, it gets whichever other image the
 * platform can find, which is how a portrait ends up on a home screen or a bookmark tile.
 *
 * Run with pnpm exec tsx tools/build-app-icons.mts after editing the mark.
 */

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const markPath = path.join(rootDir, 'src', 'app', 'icon.svg')
const outputDir = path.join(rootDir, 'public')

/** The theme's own background. These icons are drawn on it rather than left transparent, since iOS
 *  fills a transparent touch icon with black anyway and Android composites it onto whatever it
 *  likes, neither of which is a decision worth leaving to them */
const BACKDROP = '#0a0a0a'

/** The share of the frame the mark occupies. The rest is breathing room, which every platform
 *  expects to be part of the icon rather than something it adds */
const MARK_SCALE = 0.68

const OUTPUTS = [
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
]

/**
 * The mark strokes itself black or white depending on the reader's theme, which a still image
 * cannot do. Since these all sit on the dark backdrop above, the light half is what gets baked in.
 */
async function readMarkAsLightStroke() {
  const source = await readFile(markPath, 'utf8')

  if (!source.includes('.adaptive-stroke')) {
    throw new Error('The mark no longer carries the adaptive-stroke class this script rewrites')
  }

  return source.replace(
    /<style>[\s\S]*?<\/style>/,
    '<style>.adaptive-stroke { stroke: #ffffff; color: #ffffff; }</style>',
  )
}

const mark = await readMarkAsLightStroke()

for (const { file, size } of OUTPUTS) {
  const markSize = Math.round(size * MARK_SCALE)
  const inset = Math.round((size - markSize) / 2)

  const rendered = await sharp(Buffer.from(mark), { density: 384 })
    .resize(markSize, markSize)
    .png()
    .toBuffer()

  const icon = await sharp({
    create: { width: size, height: size, channels: 4, background: BACKDROP },
  })
    .composite([{ input: rendered, top: inset, left: inset }])
    .png()
    .toBuffer()

  await writeFile(path.join(outputDir, file), icon)
  console.log(`  ${file.padEnd(22)}${size}x${size}  ${(icon.length / 1024).toFixed(1)} KB`)
}

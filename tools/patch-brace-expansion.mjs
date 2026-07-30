import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'

const require = createRequire(import.meta.url)
const packagePath = require.resolve('brace-expansion/package.json')
const packageJson = JSON.parse(await readFile(packagePath, 'utf8'))

if (packageJson.version !== '5.0.8') {
  throw new Error(
    `Update the brace-expansion compatibility patch for version ${packageJson.version}`,
  )
}

const commonJsPath = resolve(dirname(packagePath), packageJson.main)
const source = await readFile(commonJsPath, 'utf8')
const marker = '// Legacy minimatch compatibility'

if (!source.includes(marker)) {
  if (!source.includes('exports.expand = expand')) {
    throw new Error('Could not find the brace-expansion CommonJS export')
  }

  await writeFile(
    commonJsPath,
    `${source}\n${marker}\nmodule.exports = Object.assign(exports.expand, exports)\n`,
  )
}

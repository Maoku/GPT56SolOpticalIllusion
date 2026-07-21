import { gzipSync } from 'node:zlib'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const limit = 5 * 1024 * 1024
const files = []

function visit(directory) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name)
    if (statSync(path).isDirectory()) visit(path)
    else if (!path.endsWith('.map')) files.push(path)
  }
}

visit('dist')
const compressed = files.reduce((total, file) => total + gzipSync(readFileSync(file)).byteLength, 0)
console.log(`Initial deploy payload (gzip estimate): ${(compressed / 1024 / 1024).toFixed(2)} MB`)
if (compressed > limit) {
  console.error('Build exceeds the 5 MB compressed payload budget')
  process.exit(1)
}

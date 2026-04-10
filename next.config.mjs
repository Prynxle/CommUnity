/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const nextConfig = {
  /**
   * Fixes cases where Next infers the wrong workspace root (e.g. due to a lockfile
   * outside this project), which can lead to missing traced/chunked modules at runtime.
   */
  outputFileTracingRoot: path.resolve(path.dirname(fileURLToPath(import.meta.url))),
}

export default nextConfig


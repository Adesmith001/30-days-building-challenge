import { randomFillSync } from 'node:crypto'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function localNetworkApi(): Plugin {
  return {
    name: 'local-network-api',
    configureServer(server) {
      server.middlewares.use('/api/ping', (_req, res) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
        res.end(JSON.stringify({ ok: true, timestamp: Date.now() }))
      })

      server.middlewares.use('/api/download', (req, res) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const requested = Number(url.searchParams.get('bytes') ?? 256 * 1024)
        const size = Math.max(64 * 1024, Math.min(2 * 1024 * 1024, Number.isFinite(requested) ? requested : 256 * 1024))
        const payload = Buffer.alloc(size)
        randomFillSync(payload)

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/octet-stream')
        res.setHeader('Content-Length', String(size))
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
        res.end(payload)
      })

      server.middlewares.use('/api/upload', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end()
          return
        }

        let receivedBytes = 0
        req.on('data', (chunk: Buffer) => { receivedBytes += chunk.length })
        req.on('end', () => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'no-store')
          res.end(JSON.stringify({ receivedBytes }))
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localNetworkApi()],
})

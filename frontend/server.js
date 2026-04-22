import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.join(__dirname, 'dist')
const port = Number(process.env.PORT) || 4173

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
}

async function sendFile(res, filePath) {
  try {
    const data = await fs.readFile(filePath)
    const ext = path.extname(filePath)
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    })
    res.end(data)
    return true
  } catch {
    return false
  }
}

const server = http.createServer(async (req, res) => {
  const rawUrl = req.url || '/'
  const requestPath = decodeURIComponent(rawUrl.split('?')[0])
  const safePath = path.normalize(requestPath).replace(/^(\.\.(\/|\\|$))+/, '')
  const candidate = path.join(distDir, safePath)

  try {
    const stat = await fs.stat(candidate)
    if (stat.isDirectory()) {
      const indexPath = path.join(candidate, 'index.html')
      if (await sendFile(res, indexPath)) return
    } else if (await sendFile(res, candidate)) {
      return
    }
  } catch {
    // Fall through to SPA fallback.
  }

  if (await sendFile(res, path.join(distDir, 'index.html'))) return

  res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('Build output not found. Run npm run build first.')
})

server.listen(port, '0.0.0.0', () => {
  console.log(`Frontend server listening on port ${port}`)
})

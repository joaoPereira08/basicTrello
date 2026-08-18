import type { FullConfig } from '@playwright/test'


async function globalSetup(config: FullConfig) {
  const apiBase = process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000'
  const maxWaitMs = 90_000
  const intervalMs = 3_000
  const start = Date.now()

  console.log(`\n Waiting for ${apiBase} ...`)

  while (Date.now() - start < maxWaitMs) {
    try {
      const res = await fetch(`${apiBase}/boards/`)
      if (res.ok) {
        console.log(` Backend woke up after ${Math.round((Date.now() - start) / 1000)}s\n`)
        return
      }
    } catch {
    
    }
    await new Promise((r) => setTimeout(r, intervalMs))
  }

  console.warn('Backend not responding after 90s, tests may fail')
}

export default globalSetup
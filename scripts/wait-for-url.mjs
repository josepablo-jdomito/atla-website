const url = process.env.WAIT_FOR_URL || process.argv[2] || 'http://127.0.0.1:3000'
const timeoutMs = Number(process.env.WAIT_FOR_TIMEOUT_MS || 120000)
const intervalMs = Number(process.env.WAIT_FOR_INTERVAL_MS || 2000)

const started = Date.now()

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function canReach(target) {
  try {
    const response = await fetch(target)
    return response.status < 500
  } catch {
    return false
  }
}

while (Date.now() - started <= timeoutMs) {
  if (await canReach(url)) {
    console.log(`Reachable: ${url}`)
    process.exit(0)
  }

  await sleep(intervalMs)
}

console.error(`Timeout waiting for URL: ${url}`)
process.exit(1)

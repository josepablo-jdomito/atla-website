const BASE_URL = (process.env.BASE_URL || 'http://127.0.0.1:3000').replace(/\/+$/, '')
const PROJECT_DETAIL_URL = process.env.PROJECT_DETAIL_URL || `${BASE_URL}/projects`
const CORE_ROUTES = ['/', '/projects', '/articles', '/brands', '/contact']

function getHeader(response, key) {
  return response.headers.get(key.toLowerCase()) || response.headers.get(key) || ''
}

function parseMaxAge(value) {
  const match = value.match(/max-age=(\d+)/i)
  return match ? Number(match[1]) : 0
}

function checkRouteHeaders(route, headers) {
  const failures = []

  const csp = headers['content-security-policy'] || ''
  if (!csp) {
    failures.push({ header: 'Content-Security-Policy', reason: 'missing' })
  } else {
    if (!csp.includes("frame-ancestors 'none'")) {
      failures.push({ header: 'Content-Security-Policy', reason: "missing frame-ancestors 'none'" })
    }

    if (!csp.includes("object-src 'none'")) {
      failures.push({ header: 'Content-Security-Policy', reason: "missing object-src 'none'" })
    }

    if (csp.includes("'unsafe-eval'")) {
      failures.push({ header: 'Content-Security-Policy', reason: "contains weak source 'unsafe-eval'" })
    }
  }

  const hsts = headers['strict-transport-security'] || ''
  if (!hsts) {
    failures.push({ header: 'Strict-Transport-Security', reason: 'missing' })
  } else {
    if (parseMaxAge(hsts) < 31536000) {
      failures.push({ header: 'Strict-Transport-Security', reason: 'max-age below 31536000' })
    }

    if (!/includesubdomains/i.test(hsts)) {
      failures.push({ header: 'Strict-Transport-Security', reason: 'missing includeSubDomains' })
    }
  }

  const xcto = headers['x-content-type-options'] || ''
  if (xcto.toLowerCase() !== 'nosniff') {
    failures.push({ header: 'X-Content-Type-Options', reason: `expected nosniff, got '${xcto || 'missing'}'` })
  }

  const xfo = headers['x-frame-options'] || ''
  if (xfo.toUpperCase() !== 'DENY') {
    failures.push({ header: 'X-Frame-Options', reason: `expected DENY, got '${xfo || 'missing'}'` })
  }

  const referrerPolicy = headers['referrer-policy'] || ''
  if (referrerPolicy.toLowerCase() !== 'strict-origin-when-cross-origin') {
    failures.push({
      header: 'Referrer-Policy',
      reason: `expected strict-origin-when-cross-origin, got '${referrerPolicy || 'missing'}'`,
    })
  }

  const permissionsPolicy = headers['permissions-policy'] || ''
  if (!permissionsPolicy) {
    failures.push({ header: 'Permissions-Policy', reason: 'missing' })
  } else {
    if (!permissionsPolicy.includes('camera=()')) {
      failures.push({ header: 'Permissions-Policy', reason: 'missing camera=()' })
    }

    if (!permissionsPolicy.includes('microphone=()')) {
      failures.push({ header: 'Permissions-Policy', reason: 'missing microphone=()' })
    }
  }

  return failures
}

function toRoute(input) {
  if (input.startsWith('/')) return input
  try {
    const parsed = new URL(input)
    return `${parsed.pathname}${parsed.search}`
  } catch {
    return '/projects'
  }
}

const allFailures = []
const routes = [...new Set([...CORE_ROUTES, toRoute(PROJECT_DETAIL_URL)])]

for (const route of routes) {
  const url = `${BASE_URL}${route}`
  let response

  try {
    response = await fetch(url)
  } catch (error) {
    allFailures.push({ route, header: 'REQUEST', reason: `network error: ${String(error)}` })
    continue
  }

  if (response.status >= 400) {
    allFailures.push({ route, header: 'REQUEST', reason: `status ${response.status}` })
    continue
  }

  const headers = {
    'content-security-policy': getHeader(response, 'content-security-policy'),
    'strict-transport-security': getHeader(response, 'strict-transport-security'),
    'x-content-type-options': getHeader(response, 'x-content-type-options'),
    'x-frame-options': getHeader(response, 'x-frame-options'),
    'referrer-policy': getHeader(response, 'referrer-policy'),
    'permissions-policy': getHeader(response, 'permissions-policy'),
  }

  const failures = checkRouteHeaders(route, headers)
  for (const failure of failures) {
    allFailures.push({ route, ...failure })
  }
}

if (allFailures.length > 0) {
  console.log('Header regression test failed:')
  for (const failure of allFailures) {
    console.log(`- route=${failure.route} header=${failure.header} issue=${failure.reason}`)
  }
  process.exit(1)
}

console.log('Header regression test passed on core routes.')

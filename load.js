import http from 'k6/http'
import { check, sleep } from 'k6'

export let options = {
  vus: 1000,
  duration: '30s',
  setupTimeout: '5m',
}

const BASE = 'https://comm-unity-brown.vercel.app'

const testAccounts = [
  { email: 'espirituzedricks@gmail.com', password: 'admin123' },
  { email: 'jalcantara19b-0009@olopsc.edu.ph', password: 'Gandasiashley22#!' },
  { email: 'lconstantino23A-0100@olopsc.edu.ph', password: 'Avoidme' },
  { email: 'trixieanneurbano2416@gmail.com', password: 'Kulotskie12345!' },
  { email: 'prynxleprem@gmail.com', password: 'admin123' },
]

export function setup() {
  console.log(`Logging in ${testAccounts.length} test accounts...`)
  const tokens = []

  for (const account of testAccounts) {
    const loginRes = http.post(
      `${BASE}/api/auth/login`,
      JSON.stringify({
        email: account.email,
        password: account.password,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )

    if (loginRes.status === 200) {
      const data = JSON.parse(loginRes.body)
      const token = data?.access_token ?? data?.session?.access_token
      if (token) {
        tokens.push(token)
        console.log(`✓ ${account.email} logged in`)
      } else {
        console.log(`✗ ${account.email} - no token in response`)
      }
    } else {
      console.log(`✗ ${account.email} login failed: ${loginRes.status} ${loginRes.body}`)
    }

    sleep(0.5)
  }

  console.log(`Total tokens obtained: ${tokens.length}`)
  return { tokens }
}

export default function (data) {
  const tokens = data?.tokens || []
  if (tokens.length === 0) {
    console.log('No tokens available, skipping test')
    return
  }

  const png = open('./scripts/1x1.png', 'b')
  const reportRes = http.post(
    `${BASE}/api/reports`,
    {
      category: 'Peer Conflict',
      locationCategory: '1st floor',
      subLocation: 'LRC',
      description: 'Sample report from load test',
      first_name: 'Load',
      email: 'loadtest@example.com',
      photo: http.file(png, 'evidence.png', 'image/png'),
    }
  )

  check(reportRes, { 'report submitted': (r) => r.status === 200 })

  if (reportRes.status !== 200) {
    console.log('Report failed:', reportRes.status, reportRes.body)
  }

  sleep(5)
}



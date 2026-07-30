/**
 * Wraps next dev so a phone on the same network can open the site straight from a QR code in the
 * terminal. It picks the LAN address itself, waits until the server actually answers on it and only
 * then prints the code, which is why this is a wrapper rather than a printed hint in the scripts.
 *
 * Pass --mobile-host to override the address it chooses.
 */

import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { networkInterfaces } from 'node:os'
import { stripVTControlCharacters } from 'node:util'

const require = createRequire(import.meta.url)
const nextCli = require.resolve('next/dist/bin/next')
const QRCode = require('qrcode') as {
  toString(
    text: string,
    options: {
      type: 'terminal'
      errorCorrectionLevel: 'M'
      margin: number
      small: boolean
    },
  ): Promise<string>
}
const rawArgs = process.argv.slice(2)

type NetworkCandidate = {
  name: string
  address: string
  family: string
  internal: boolean
}

/** Reads a flag in either form, --port 3000 or --port=3000, without pulling in a parser */
function readOption(args: string[], longName: string, shortName?: string) {
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]

    if (argument === longName || (shortName && argument === shortName)) {
      return args[index + 1]
    }

    if (argument.startsWith(`${longName}=`)) {
      return argument.slice(longName.length + 1)
    }
  }

  return undefined
}

/** Strips our own flag from the list, so next dev is never handed an argument it rejects */
function removeOption(args: string[], longName: string) {
  const result: string[] = []

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]

    if (argument === longName) {
      index += 1
      continue
    }

    if (argument.startsWith(`${longName}=`)) continue
    result.push(argument)
  }

  return result
}

function normalizeHost(value: string | undefined) {
  if (!value) return undefined

  try {
    const url = new URL(value.includes('://') ? value : `http://${value}`)
    return url.hostname.replace(/^\[|\]$/g, '')
  } catch {
    return undefined
  }
}

/** The RFC 1918 ranges, the only addresses a phone on the same network can reach us on */
function isPrivateIpv4(address: string) {
  if (address.startsWith('10.') || address.startsWith('192.168.')) return true

  if (address.startsWith('172.')) {
    const secondOctet = Number(address.split('.')[1])
    return secondOctet >= 16 && secondOctet <= 31
  }

  return false
}

/**
 * Picks the address a phone is most likely to reach. Physical ethernet and wireless adapters are
 * scored up and the virtual ones that Docker, WSL and VPN clients leave behind are scored down,
 * since those answer locally but are unreachable from another device.
 */
function findLanAddress() {
  const virtualInterfacePattern =
    /docker|hyper-v|loopback|tailscale|veth|virtual|vmware|vpn|wsl|zerotier/i
  const preferredInterfacePattern = /ethernet|^en\d|^eth\d|wi-?fi|wireless|wlan/i

  return Object.entries(networkInterfaces())
    .flatMap(([name, addresses]) =>
      (addresses ?? []).map((address) => ({
        name,
        address: address.address,
        family: address.family,
        internal: address.internal,
      })),
    )
    .filter(
      ({ address, family, internal }) => !internal && family === 'IPv4' && isPrivateIpv4(address),
    )
    .sort((left, right) => {
      const score = ({ name }: NetworkCandidate) =>
        (preferredInterfacePattern.test(name) ? 2 : 0) -
        (virtualInterfacePattern.test(name) ? 4 : 0)

      return score(right) - score(left)
    })[0]?.address
}

function getRequestedPort(args: string[]) {
  const configuredPort = readOption(args, '--port', '-p') ?? process.env.PORT ?? '3000'
  const port = Number(configuredPort)
  return Number.isInteger(port) && port > 0 ? port : 3000
}

function formatUrlHost(host: string) {
  return host.includes(':') ? `[${host}]` : host
}

const forwardedArgs = removeOption(rawArgs, '--mobile-host')
const configuredHostname = normalizeHost(readOption(forwardedArgs, '--hostname', '-H'))
const requestedMobileHost = readOption(rawArgs, '--mobile-host') ?? process.env.DEV_MOBILE_HOST
const normalizedMobileHost = normalizeHost(requestedMobileHost)
const isLoopbackBinding =
  configuredHostname === 'localhost' ||
  configuredHostname === '127.0.0.1' ||
  configuredHostname === '::1'
const mobileHost =
  normalizedMobileHost ??
  (configuredHostname && configuredHostname !== '0.0.0.0' && configuredHostname !== '::'
    ? configuredHostname
    : findLanAddress())

if (requestedMobileHost && !normalizedMobileHost) {
  console.warn(
    `Ignoring invalid mobile host "${requestedMobileHost}". Pass an IP or hostname without a path.`,
  )
}

const child = spawn(process.execPath, [nextCli, 'dev', ...forwardedArgs], {
  env: {
    ...process.env,
    ...(mobileHost ? { NEXT_DEV_ALLOWED_ORIGIN: mobileHost } : {}),
  },
  stdio: ['inherit', 'pipe', 'pipe'],
})

let actualPort = getRequestedPort(forwardedArgs)
let actualProtocol = 'http'
let recentOutput = ''
let previewStarted = false

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

/**
 * Next prints the port it settled on, which may not be the one requested if that was taken, so the
 * URL is read back out of its output rather than assumed. The buffer is trimmed as it grows because
 * a long dev session would otherwise keep every line in memory.
 */
function inspectServerOutput(chunk: Buffer) {
  recentOutput = `${recentOutput}${stripVTControlCharacters(chunk.toString())}`.slice(-12_000)

  const localUrl = recentOutput.match(/-\s+Local:\s+(https?:\/\/\S+)/)?.[1]
  const networkUrl = recentOutput.match(/-\s+Network:\s+(https?:\/\/\S+)/)?.[1]

  for (const candidate of [localUrl, networkUrl]) {
    if (!candidate) continue

    try {
      const parsedUrl = new URL(candidate)
      const parsedPort = Number(parsedUrl.port)
      if (parsedPort) actualPort = parsedPort
      actualProtocol = parsedUrl.protocol.replace(':', '')
    } catch {}
  }

  if (/Ready in|✓\s+Ready/.test(recentOutput)) {
    showMobilePreview().catch((error) => {
      console.warn(`Could not generate the mobile QR code: ${getErrorMessage(error)}`)
    })
  }
}

child.stdout.on('data', (chunk) => {
  process.stdout.write(chunk)
  inspectServerOutput(chunk)
})

child.stderr.on('data', (chunk) => {
  process.stderr.write(chunk)
  inspectServerOutput(chunk)
})

/**
 * Ready in the output only means Next has bound, not that the address is reachable, so the URL is
 * polled before a code is shown. Anything under a 500 counts, since a 404 still proves it answered.
 */
async function waitForReachable(url: string) {
  const deadline = Date.now() + 30_000

  while (Date.now() < deadline && child.exitCode === null) {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: AbortSignal.timeout(3_000),
      })

      if (response.status < 500) return true
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  return false
}

/** Prints the QR code once per run, with a specific reason whenever it cannot */
async function showMobilePreview() {
  if (previewStarted) return
  previewStarted = true

  if (isLoopbackBinding) {
    console.warn('\nMobile preview is unavailable when Next.js is bound to localhost.\n')
    return
  }

  if (!mobileHost) {
    console.warn(
      '\nNo private LAN address was found. Retry with npm run dev -- --mobile-host <your-ip>.\n',
    )
    return
  }

  const mobileUrl = `${actualProtocol}://${formatUrlHost(mobileHost)}:${actualPort}`
  const reachable = await waitForReachable(mobileUrl)

  if (!reachable) {
    console.warn(
      `\n${mobileUrl} did not answer locally. Check the selected host or retry with --mobile-host.\n`,
    )
  }

  const qr = await QRCode.toString(mobileUrl, {
    type: 'terminal',
    errorCorrectionLevel: 'M',
    margin: 2,
    small: true,
  })

  console.log(`\nMobile preview: ${mobileUrl}`)
  console.log('Scan from a phone on the same Wi-Fi network:\n')
  console.log(qr)
}

child.on('error', (error) => {
  console.error('Failed to start the Next.js development server:', error)
  process.exitCode = 1
})

child.on('exit', (code) => {
  process.exitCode = code ?? 1
})

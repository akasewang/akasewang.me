/**
 * Wraps next dev so a phone on the same network can open the site straight from a QR code in the
 * terminal. It picks the LAN address itself, waits until the server actually answers on it and only
 * then prints the code, which is why this is a wrapper rather than a printed hint in the scripts.
 *
 * Pass --mobile-host to override the address it chooses.
 */

import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { createServer, isIP, type ListenOptions } from 'node:net'
import { networkInterfaces } from 'node:os'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
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
const DEFAULT_PORT = 3000
const MAX_PORT = 65_535
const PORT_SCAN_LIMIT = 100

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
      const value = args[index + 1]

      if (!value || value.startsWith('-')) {
        throw new Error(`${argument} requires a value.`)
      }

      return value
    }

    for (const name of [longName, shortName].filter((name): name is string => Boolean(name))) {
      if (!argument.startsWith(`${name}=`)) continue

      const value = argument.slice(name.length + 1)
      if (!value) throw new Error(`${name} requires a value.`)
      return value
    }
  }

  return undefined
}

/** Strips an option before replacing it or keeping a wrapper-only flag away from Next.js */
function removeOption(args: string[], longName: string, shortName?: string) {
  const result: string[] = []
  const names = [longName, shortName].filter((name): name is string => Boolean(name))

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]

    if (names.includes(argument)) {
      index += 1
      continue
    }

    if (names.some((name) => argument.startsWith(`${name}=`))) continue
    result.push(argument)
  }

  return result
}

/**
 * Reduces whatever was given to a bare hostname, or refuses it. A port, a path or credentials mean
 * the value was meant as something else, and guessing at it would bind to the wrong place.
 */
function normalizeHost(value: string | undefined) {
  if (!value) return undefined

  const unwrappedValue = value.replace(/^\[|\]$/g, '')
  if (isIP(unwrappedValue)) return unwrappedValue

  try {
    const url = new URL(value.includes('://') ? value : `http://${value}`)

    if (
      url.username ||
      url.password ||
      url.port ||
      url.pathname !== '/' ||
      url.search ||
      url.hash
    ) {
      return undefined
    }

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

/** The port asked for on the command line, then in the environment, then the default */
function getRequestedPort(args: string[]) {
  const configuredPort = readOption(args, '--port', '-p') ?? process.env.PORT
  if (configuredPort === undefined) return DEFAULT_PORT

  const port = Number(configuredPort)

  if (!/^\d+$/.test(configuredPort) || !Number.isInteger(port) || port < 1 || port > MAX_PORT) {
    throw new Error(`Invalid port "${configuredPort}". Use a whole number from 1 to ${MAX_PORT}.`)
  }

  return port
}

/** An IPv6 address has to be bracketed before it can go in a URL */
function formatUrlHost(host: string) {
  return host.includes(':') ? `[${host}]` : host
}

/** Whether an address means this machine, in any of the several ways it can be written */
function isLoopbackHost(host: string) {
  const normalizedHost = host.toLowerCase().replace(/\.$/, '')

  if (normalizedHost === 'localhost' || normalizedHost === '::1') return true
  if (isIP(normalizedHost) === 4) return normalizedHost.startsWith('127.')

  return normalizedHost.startsWith('::ffff:127.')
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

type PortProbe = ListenOptions & { optional?: boolean }

/**
 * Covers every address family that can win when a browser resolves localhost. Next's default bind
 * can coexist with an IPv6-only listener on Windows, but the browser may still open that listener
 * instead; probing both families prevents two different sites from claiming the same local URL.
 */
function getPortProbes(hostname: string | undefined): PortProbe[] {
  if (!hostname || hostname === '0.0.0.0' || hostname === '::') {
    return [
      { host: '127.0.0.1' },
      { host: '::1', ipv6Only: true, optional: true },
      { host: '0.0.0.0' },
      { host: '::', ipv6Only: true, optional: true },
    ]
  }

  if (hostname === 'localhost') {
    return [{ host: '127.0.0.1' }, { host: '::1', ipv6Only: true, optional: true }]
  }

  return [{ host: hostname, ...(isIP(hostname) === 6 ? { ipv6Only: true } : {}) }]
}

/** Tries one bind and releases it immediately; unsupported optional IPv6 is not a collision. */
function probePort(port: number, { optional, ...options }: PortProbe) {
  return new Promise<boolean>((resolve, reject) => {
    const server = createServer()

    server.unref()
    server.once('error', (error: NodeJS.ErrnoException) => {
      if (optional && (error.code === 'EAFNOSUPPORT' || error.code === 'EADDRNOTAVAIL')) {
        resolve(true)
        return
      }

      if (error.code === 'EADDRINUSE' || error.code === 'EACCES') {
        resolve(false)
        return
      }

      reject(error)
    })
    server.listen({ ...options, port, exclusive: true }, () => {
      server.close((error) => (error ? reject(error) : resolve(true)))
    })
  })
}

/** Free only if every probe for it is, since one taken family is enough to collide */
async function isPortAvailable(port: number, hostname: string | undefined) {
  for (const probe of getPortProbes(hostname)) {
    if (!(await probePort(port, probe))) return false
  }

  return true
}

/** Finds a nearby free port deterministically instead of relying on Next's single-family check. */
/** Counts up from the port asked for, so a second dev server lands beside the first */
async function findAvailablePort(requestedPort: number, hostname: string | undefined) {
  const lastPort = Math.min(MAX_PORT, requestedPort + PORT_SCAN_LIMIT - 1)

  for (let port = requestedPort; port <= lastPort; port += 1) {
    if (await isPortAvailable(port, hostname)) return port
  }

  throw new Error(
    `No free port was found from ${requestedPort} through ${lastPort}. Stop an existing server or pass --port <port>.`,
  )
}

async function startDevServer() {
  const argsWithoutMobileHost = removeOption(rawArgs, '--mobile-host')
  const configuredHostnameValue = readOption(argsWithoutMobileHost, '--hostname', '-H')
  const configuredHostname = normalizeHost(configuredHostnameValue)
  const requestedMobileHost = readOption(rawArgs, '--mobile-host') ?? process.env.DEV_MOBILE_HOST
  const normalizedMobileHost = normalizeHost(requestedMobileHost)
  const isLoopbackBinding = configuredHostname ? isLoopbackHost(configuredHostname) : false
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

  if (configuredHostnameValue && !configuredHostname) {
    throw new Error(
      `Invalid hostname "${configuredHostnameValue}". Pass an IP or hostname without a path or port.`,
    )
  }

  const requestedPort = getRequestedPort(argsWithoutMobileHost)
  const actualPort = await findAvailablePort(requestedPort, configuredHostname)
  const forwardedArgs = [
    ...removeOption(removeOption(argsWithoutMobileHost, '--port', '-p'), '--hostname', '-H'),
    ...(configuredHostname ? ['--hostname', configuredHostname] : []),
    '--port',
    String(actualPort),
  ]

  if (actualPort !== requestedPort) {
    console.warn(
      `Port ${requestedPort} is occupied on IPv4 or IPv6; using the first fully available port, ${actualPort}.`,
    )
  }

  const child = spawn(process.execPath, [nextCli, 'dev', ...forwardedArgs], {
    env: {
      ...process.env,
      ...(mobileHost ? { NEXT_DEV_ALLOWED_ORIGIN: mobileHost } : {}),
    },
    stdio: ['inherit', 'pipe', 'pipe'],
  })

  let actualProtocol = 'http'
  let recentOutput = ''
  let previewStarted = false

  /**
   * The selected port is pinned before launch, while the protocol is read from Next's output so HTTPS
   * development remains accurate. The buffer is trimmed because a long session must not retain every
   * line it has printed.
   */
  function inspectServerOutput(chunk: Buffer) {
    recentOutput = `${recentOutput}${stripVTControlCharacters(chunk.toString())}`.slice(-12_000)

    const localUrl = recentOutput.match(/-\s+Local:\s+(https?:\/\/\S+)/)?.[1]
    const networkUrl = recentOutput.match(/-\s+Network:\s+(https?:\/\/\S+)/)?.[1]

    for (const candidate of [localUrl, networkUrl]) {
      if (!candidate) continue

      /** Output that does not parse as a URL is not the line being looked for */
      try {
        const parsedUrl = new URL(candidate)
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
      /** A refused connection only means it is not up yet, so the loop keeps trying */
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
        '\nNo private LAN address was found. Retry with pnpm run dev -- --mobile-host <your-ip>.\n',
      )
      return
    }

    if (isLoopbackHost(mobileHost)) {
      console.warn(
        '\nMobile preview is unavailable because the selected mobile host is loopback-only.\n',
      )
      return
    }

    const mobileUrl = `${actualProtocol}://${formatUrlHost(mobileHost)}:${actualPort}`
    const reachable = await waitForReachable(mobileUrl)

    if (!reachable) {
      console.warn(
        `\n${mobileUrl} did not answer locally. Check the selected host or retry with --mobile-host.\n`,
      )
      return
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

  let requestedExitCode: number | undefined
  let forceShutdownTimer: NodeJS.Timeout | undefined

  /** Lets Next release its lock and child workers when the wrapper receives a terminal signal. */
  function stopChild(signal: NodeJS.Signals, exitCode: number) {
    requestedExitCode ??= exitCode
    if (child.exitCode !== null) return

    if (!child.killed) child.kill(signal)
    forceShutdownTimer ??= setTimeout(() => {
      if (child.exitCode === null) child.kill('SIGKILL')
    }, 5_000)
    forceShutdownTimer.unref()
  }

  process.once('SIGINT', () => stopChild('SIGINT', 130))
  process.once('SIGTERM', () => stopChild('SIGTERM', 143))
  process.once('SIGHUP', () => stopChild('SIGHUP', 129))

  child.on('exit', (code) => {
    if (forceShutdownTimer) clearTimeout(forceShutdownTimer)
    process.exitCode = code ?? requestedExitCode ?? 1
  })
}

const isDirectRun =
  process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectRun) {
  startDevServer().catch((error) => {
    console.error(`Could not start the development server: ${getErrorMessage(error)}`)
    process.exitCode = 1
  })
}

export {
  findAvailablePort,
  getPortProbes,
  getRequestedPort,
  isLoopbackHost,
  normalizeHost,
  readOption,
  removeOption,
}

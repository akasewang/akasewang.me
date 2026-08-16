import assert from 'node:assert/strict'
import { createServer } from 'node:net'
import test from 'node:test'
import {
  findAvailablePort,
  getPortProbes,
  getRequestedPort,
  isLoopbackHost,
  normalizeHost,
  readOption,
  removeOption,
} from './dev-server'

/**
 * The dev server's argument parsing and port picking. Both deal in what a person types and what a
 * machine already has running, so both are tested against the awkward cases rather than the happy one.
 */

test('reads long and short options in separated and equals forms', () => {
  assert.equal(readOption(['--port', '3100'], '--port', '-p'), '3100')
  assert.equal(readOption(['--port=3101'], '--port', '-p'), '3101')
  assert.equal(readOption(['-p', '3102'], '--port', '-p'), '3102')
  assert.equal(readOption(['-p=3103'], '--port', '-p'), '3103')
})

test('rejects an option without a value', () => {
  assert.throws(() => readOption(['--port'], '--port', '-p'), /requires a value/)
  assert.throws(() => readOption(['--port='], '--port', '-p'), /requires a value/)
})

test('removes every supported spelling of a replaced option', () => {
  assert.deepEqual(removeOption(['site', '--port', '3100', '--turbo'], '--port', '-p'), [
    'site',
    '--turbo',
  ])
  assert.deepEqual(removeOption(['site', '-p=3100'], '--port', '-p'), ['site'])
})

test('normalizes valid hosts and rejects paths, credentials and ports', () => {
  assert.equal(normalizeHost('http://LOCALHOST'), 'localhost')
  assert.equal(normalizeHost('[::1]'), '::1')
  assert.equal(normalizeHost('192.168.1.25'), '192.168.1.25')
  assert.equal(normalizeHost('localhost:3100'), undefined)
  assert.equal(normalizeHost('https://user@example.com'), undefined)
  assert.equal(normalizeHost('https://example.com/path'), undefined)
})

test('recognizes IPv4, IPv6 and hostname loopback addresses', () => {
  assert.equal(isLoopbackHost('localhost.'), true)
  assert.equal(isLoopbackHost('127.42.0.1'), true)
  assert.equal(isLoopbackHost('::1'), true)
  assert.equal(isLoopbackHost('::ffff:127.0.0.1'), true)
  assert.equal(isLoopbackHost('192.168.1.25'), false)
})

test('validates the complete TCP port range', () => {
  assert.equal(getRequestedPort(['--port', '1']), 1)
  assert.equal(getRequestedPort(['-p=65535']), 65_535)
  assert.throws(() => getRequestedPort(['--port', '0']), /Invalid port/)
  assert.throws(() => getRequestedPort(['--port', '65536']), /Invalid port/)
  assert.throws(() => getRequestedPort(['--port', '3000.5']), /Invalid port/)
})

test('default binding probes explicit loopbacks as well as wildcard addresses', () => {
  const probes = getPortProbes(undefined)
  assert.deepEqual(
    probes.map(({ host }) => host),
    ['127.0.0.1', '::1', '0.0.0.0', '::'],
  )
})

test('skips a port held only on IPv6 loopback', async (context) => {
  const blocker = createServer()

  try {
    await new Promise<void>((resolve, reject) => {
      blocker.once('error', reject)
      blocker.listen({ host: '::1', port: 0, ipv6Only: true, exclusive: true }, resolve)
    })
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code
    if (code === 'EAFNOSUPPORT' || code === 'EADDRNOTAVAIL') {
      context.skip('IPv6 loopback is unavailable on this system')
      return
    }
    throw error
  }

  context.after(
    () =>
      new Promise<void>((resolve, reject) => {
        blocker.close((error) => (error ? reject(error) : resolve()))
      }),
  )

  const address = blocker.address()
  assert.notEqual(address, null)
  assert.equal(typeof address, 'object')
  if (!address || typeof address === 'string') throw new Error('Expected a TCP address object.')

  const selectedPort = await findAvailablePort(address.port, undefined)
  assert.ok(selectedPort > address.port)
})

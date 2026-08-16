import assert from 'node:assert/strict'
import test from 'node:test'
import { REVEAL_SETTLE_MS } from '../src/constants/ui'
import {
  getInitialLoaderCount,
  INITIAL_LOADER_FINAL_COUNT,
  INITIAL_LOADER_TIMELINE,
} from '../src/utils/initial-loader'

/**
 * The loader's timings, tested away from the component. Everything here is pure arithmetic over the
 * constants, which is exactly the part that breaks silently when a duration is changed by hand.
 */

/** The count only ever goes up, never leaves its range and lands on the final value */
test('counter is elapsed-time based, bounded and monotonic', () => {
  assert.equal(getInitialLoaderCount(-1), 1)
  assert.equal(getInitialLoaderCount(0), 1)
  assert.equal(
    getInitialLoaderCount(INITIAL_LOADER_TIMELINE.countEndsAt),
    INITIAL_LOADER_FINAL_COUNT,
  )
  assert.equal(getInitialLoaderCount(INITIAL_LOADER_TIMELINE.finishAt), INITIAL_LOADER_FINAL_COUNT)

  let previous = 1
  for (let elapsed = 0; elapsed <= INITIAL_LOADER_TIMELINE.countEndsAt; elapsed += 1) {
    const current = getInitialLoaderCount(elapsed)
    assert.ok(current >= previous)
    assert.ok(current >= 1 && current <= INITIAL_LOADER_FINAL_COUNT)
    previous = current
  }
})

/**
 * The order the beats have to keep: the count lands, then leaves, then the veil goes, the focus
 * resolving before the veil does so nothing sharpens in full view, and the settle sitting last so
 * unmounting cannot cut the end off the fade.
 */
test('every visual finishes before the loader releases interaction and unmounts', () => {
  const { countEndsAt, countOutAt, fadeAt, lastDigitEndsAt, focusEndsAt, veilEndsAt, finishAt } =
    INITIAL_LOADER_TIMELINE

  assert.ok(countEndsAt < countOutAt)
  assert.ok(countOutAt < fadeAt)
  assert.ok(lastDigitEndsAt <= finishAt)
  assert.ok(focusEndsAt <= veilEndsAt)
  assert.equal(finishAt, veilEndsAt + REVEAL_SETTLE_MS)
})

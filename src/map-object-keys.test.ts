import { assert } from 'chai'

import { mapObjectKeys } from './map-object-keys'
import { success } from './result'
import { pipe } from './pipe'

describe('mapObjectKeys()', () => {
  type Obj = { foo: string; bar?: number }
  const transform = pipe((v: Obj) => success(v)).pipe(
    mapObjectKeys({
      FOO: 'foo',
      BAR: 'bar',
    })
  )

  it('should return a mapped object', () =>
    assert.deepStrictEqual(
      transform({ foo: 'test', bar: 1 }),
      success({ FOO: 'test', BAR: 1 })
    ))

  it('should return a mapped object with optional properties', () =>
    assert.deepStrictEqual(
      transform({ foo: 'test' }),
      success({ FOO: 'test' })
    ))
})

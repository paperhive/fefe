import { assert } from 'chai'

import { string } from './string'
import { FefeThrowError, toThrow } from './throw'

describe('toThrow()', () => {
  const validate = toThrow(string())

  it('should throw an error if validator returns error', () =>
    assert.throws(() => validate(1), FefeThrowError, 'Not a string.'))

  it('should validate', () => assert.deepStrictEqual(validate('foo'), 'foo'))
})

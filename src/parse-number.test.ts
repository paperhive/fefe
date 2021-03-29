import { assert } from 'chai'

import { leafError } from './errors'
import { failure, success } from './result'
import { parseNumber } from './parse-number'

describe('parseNumber()', () => {
  it('should return an error if not a number', () =>
    assert.deepStrictEqual(
      parseNumber()('foo'),
      failure(leafError('foo', 'Not a number.'))
    ))

  it('return parsed number', () =>
    assert.deepStrictEqual(parseNumber()('0.5'), success(0.5)))
})

import { assert } from 'chai'

import { leafError } from './errors'
import { failure, success } from './result'
import { parseBoolean } from './parse-boolean'

describe('parseBoolean()', () => {
  it('should return an error if not a boolean', () =>
    assert.deepStrictEqual(
      parseBoolean()('foo'),
      failure(leafError('foo', 'Not a boolean.'))
    ))

  it('return parsed boolean', () => {
    assert.deepStrictEqual(parseBoolean()('true'), success(true))
    assert.deepStrictEqual(parseBoolean()('false'), success(false))
  })
})

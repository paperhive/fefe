import { assert } from 'chai'

import { boolean } from './boolean'
import { leafError } from './errors'
import { failure, success } from './result'

describe('boolean()', () => {
  it('should return an error if not a boolean', () => {
    assert.deepStrictEqual(
      boolean()('foo'),
      failure(leafError('foo', 'Not a boolean.'))
    )
  })

  it('return a valid boolean', () =>
    assert.deepStrictEqual(boolean()(true), success(true)))
})

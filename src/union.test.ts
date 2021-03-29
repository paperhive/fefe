import { assert } from 'chai'

import { leafError } from './errors'
import { failure, success } from './result'
import { boolean } from './boolean'
import { string } from './string'
import { union } from './union'

describe('union()', () => {
  const validate = union(boolean(), string())

  it('should return an error if all validators return errors', () =>
    assert.deepStrictEqual(
      validate(1),
      failure(
        leafError(1, 'Not of any expected type (Not a boolean. Not a string.).')
      )
    ))

  it('should validate either type', () => {
    assert.deepStrictEqual(validate(false), success(false))
    assert.deepStrictEqual(validate('foo'), success('foo'))
  })
})

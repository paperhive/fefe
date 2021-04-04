import { assert } from 'chai'

import { leafError } from './errors'
import { parseBoolean } from './parse-boolean'
import { pipe } from './pipe'
import { failure, success } from './result'
import { string } from './string'

describe('pipe()', () => {
  const validate = pipe(string()).pipe(parseBoolean())

  it('should return an error if first transformer fails', () =>
    assert.deepStrictEqual(validate(1), failure(leafError(1, 'Not a string.'))))

  it('should return an error if second transformer fails', () =>
    assert.deepStrictEqual(
      validate('foo'),
      failure(leafError('foo', 'Not a boolean.'))
    ))

  it('return a valid boolean', () =>
    assert.deepStrictEqual(validate('true'), success(true)))
})

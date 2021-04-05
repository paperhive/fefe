import { assert } from 'chai'

import { branchError, leafError } from './errors'
import { object } from './object'
import { parseJson } from './parse-json'
import { pipe } from './pipe'
import { failure, success } from './result'
import { string } from './string'

describe('pipe()', () => {
  const validate = pipe(string())
    .pipe(parseJson())
    .pipe(object({ foo: string() }))

  it('should return an error if first transformer fails', () =>
    assert.deepStrictEqual(validate(1), failure(leafError(1, 'Not a string.'))))

  it('should return an error if second transformer fails', () =>
    assert.deepStrictEqual(
      validate('{]'),
      failure(
        leafError(
          '{]',
          'Invalid JSON: Unexpected token ] in JSON at position 1.'
        )
      )
    ))

  it('should return an error if third transformer fails', () =>
    assert.deepStrictEqual(
      validate('{"foo":1}'),
      failure(
        branchError({ foo: 1 }, [
          { key: 'foo', error: leafError(1, 'Not a string.') },
        ])
      )
    ))

  it('return a valid boolean', () =>
    assert.deepStrictEqual(validate('{"foo":"bar"}'), success({ foo: 'bar' })))
})

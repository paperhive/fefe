import { assert } from 'chai'
import { chain } from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'

import { branchError, leafError } from './errors'
import { array } from './array'
import { boolean } from './boolean'
import { failure, success } from './result'

describe('array()', () => {
  it('should return error if not a array', () => {
    assert.deepStrictEqual(
      array(boolean())('foo'),
      failure(leafError('foo', 'Not an array.'))
    )
  })

  it('should return error if nested validation fails', () => {
    assert.deepStrictEqual(
      array(boolean())([true, 42]),
      failure(
        branchError(
          [true, 42],
          [{ key: 1, error: leafError(42, 'Not a boolean.') }]
        )
      )
    )
  })

  it('should return all errors if nested validation fails', () => {
    assert.deepStrictEqual(
      array(boolean(), { allErrors: true })([true, 42, 1337]),
      failure(
        branchError(
          [true, 42, 1337],
          [
            { key: 1, error: leafError(42, 'Not a boolean.') },
            { key: 2, error: leafError(1337, 'Not a boolean.') },
          ]
        )
      )
    )
  })

  it('should return a valid array', () => {
    const value = [true, false]
    assert.deepStrictEqual(array(boolean())(value), success(value))
  })

  it('should return a valid array with allErrors', () => {
    const value = [true, false]
    assert.deepStrictEqual(
      array(boolean(), { allErrors: true })(value),
      success(value)
    )
  })

  it('should return a valid array with transformed values', () => {
    const transform = array(
      flow(
        boolean(),
        chain((v: boolean) => success(`transformed: ${v}`))
      )
    )
    assert.deepStrictEqual(
      transform([false, true]),
      success(['transformed: false', 'transformed: true'])
    )
  })
})

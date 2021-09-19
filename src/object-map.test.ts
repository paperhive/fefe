import { assert } from 'chai'

import { objectMap } from './object-map'
import { string } from './string'
import { branchError, leafError } from './errors'
import { failure, success } from './result'

describe('objectMap()', () => {
  it('should return an error if value is not an object', () =>
    assert.deepStrictEqual(
      objectMap(string())(null),
      failure(leafError(null, 'Not an object.'))
    ))

  it('should return an error if object has a value that does not validate', () => {
    const value = { foo: 1337 }
    assert.deepStrictEqual(
      objectMap(string())(value),
      failure(
        branchError(value, [
          { key: 'foo', error: leafError(1337, 'Not a string.') },
        ])
      )
    )
  })

  it('should return all errors if requested and object has two value that do not validate', () => {
    const value = { foo: 1337, bar: true }
    assert.deepStrictEqual(
      objectMap(string(), { allErrors: true })(value),
      failure(
        branchError(value, [
          { key: 'foo', error: leafError(1337, 'Not a string.') },
          { key: 'bar', error: leafError(true, 'Not a string.') },
        ])
      )
    )
  })

  it('should validate an object', () => {
    const value = { foo: 'bar' }
    assert.deepStrictEqual(objectMap(string())(value), success(value))
  })

  it('should validate an object with allErrors', () => {
    const value = { foo: 'bar' }
    assert.deepStrictEqual(
      objectMap(string(), { allErrors: true })(value),
      success(value)
    )
  })
})

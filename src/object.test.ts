import { assert } from 'chai'

import { object, defaultTo, optional } from './object'
import { string } from './string'
import { branchError, leafError } from './errors'
import { failure, success } from './result'
import { Validator } from './validate'
import { number } from './number'

describe('object()', () => {
  it('should return an error if value is not an object', () =>
    assert.deepStrictEqual(
      object({})(null),
      failure(leafError(null, 'Not an object.'))
    ))

  it('should return an error if object has non-allowed key', () => {
    const value = { foo: 'test', bar: true }
    assert.deepStrictEqual(
      object({ foo: string() })(value),
      failure(leafError(value, 'Properties not allowed: bar.'))
    )
  })

  it('should return an error if object has a missing key', () => {
    const value = {}
    assert.deepStrictEqual(
      object({ foo: string() })(value),
      failure(
        branchError(value, [
          { key: 'foo', error: leafError(undefined, 'Not a string.') },
        ])
      )
    )
  })

  it('should return an error if object has a value that does not validate', () => {
    const value = { foo: 1337 }
    assert.deepStrictEqual(
      object({ foo: string() })(value),
      failure(
        branchError(value, [
          { key: 'foo', error: leafError(1337, 'Not a string.') },
        ])
      )
    )
  })

  it('should return all errors if requested and object has two value that do not validate', () => {
    const value = { foo: 1337, bar: 'test' }
    assert.deepStrictEqual(
      object({ foo: string(), bar: number() }, { allErrors: true })(value),
      failure(
        branchError(value, [
          { key: 'foo', error: leafError(1337, 'Not a string.') },
          { key: 'bar', error: leafError('test', 'Not a number.') },
        ])
      )
    )
  })

  it('should validate an object', () => {
    const value = { foo: 'bar' }
    assert.deepStrictEqual(object({ foo: string() })(value), success(value))
  })

  it('should validate an object with allErrors', () => {
    const value = { foo: 'bar' }
    assert.deepStrictEqual(
      object({ foo: string() }, { allErrors: true })(value),
      success(value)
    )
  })

  it('should validate an object with optional key', () => {
    const validate: Validator<{ foo?: string }> = object({
      foo: optional(string()),
    })
    assert.deepStrictEqual(validate({ foo: 'bar' }), success({ foo: 'bar' }))
    assert.deepStrictEqual(validate({}), success({}))
    assert.notProperty(validate({}), 'foo')
    assert.deepStrictEqual(validate({ foo: undefined }), success({}))
    assert.notProperty(validate({ foo: undefined }), 'foo')
  })

  it('should validate an object with default value', () => {
    const validate = object({ foo: defaultTo(string(), 'bar') })
    assert.deepStrictEqual(validate({ foo: 'baz' }), success({ foo: 'baz' }))
    assert.deepStrictEqual(validate({}), success({ foo: 'bar' }))
    assert.deepStrictEqual(
      validate({ foo: undefined }),
      success({ foo: 'bar' })
    )
  })
})

describe('defaultTo()', () => {
  const validate = defaultTo(string(), 'foo')

  it('should validate if value is provided', () =>
    assert.deepStrictEqual(validate('bar'), success('bar')))

  it('should return an error if non-passing value is provided', () =>
    assert.deepStrictEqual(
      validate(42),
      failure(leafError(42, 'Not a string.'))
    ))

  it('should return default if no value is provided', () =>
    assert.deepStrictEqual(validate(undefined), success('foo')))
})

describe('optional()', () => {
  const validate = optional(string())

  it('should validate if value is provided', () =>
    assert.deepStrictEqual(validate('bar'), success('bar')))

  it('should return an error if non-passing value is provided', () =>
    assert.deepStrictEqual(
      validate(42),
      failure(leafError(42, 'Not a string.'))
    ))
})

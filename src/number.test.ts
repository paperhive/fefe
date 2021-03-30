import { assert } from 'chai'

import { number } from './number'
import { leafError } from './errors'
import { failure, success } from './result'

describe('number()', () => {
  it('should return an error if not a number', () => {
    assert.deepStrictEqual(
      number()('foo'),
      failure(leafError('foo', 'Not a number.'))
    )
  })

  it('should return an error if NaN', () => {
    const value = 1 / 0 - 1 / 0
    assert.deepStrictEqual(
      number()(value),
      failure(leafError(value, 'NaN is not allowed.'))
    )
  })

  it('should return an error if infinite', () => {
    const value = 1 / 0
    assert.deepStrictEqual(
      number()(value),
      failure(leafError(value, 'Infinity is not allowed.'))
    )
  })

  it('should return an error if not integer', () => {
    const value = 1.5
    assert.deepStrictEqual(
      number({ integer: true })(value),
      failure(leafError(value, 'Not an integer.'))
    )
  })

  it('should return an error if less than min', () => {
    const value = -1
    assert.deepStrictEqual(
      number({ min: 1 })(value),
      failure(leafError(value, 'Less than 1.'))
    )
  })

  it('should return an error if less than max', () => {
    const value = 11
    assert.deepStrictEqual(
      number({ max: 3 })(value),
      failure(leafError(value, 'Greater than 3.'))
    )
  })

  it('return a valid number', () => {
    const value = 2
    assert.deepStrictEqual(number({ min: 1, max: 3 })(value), success(value))
  })
})

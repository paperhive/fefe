import { assert } from 'chai'

import { leafError } from './errors'
import { date } from './date'
import { failure, success } from './result'

describe('date()', () => {
  it('should return an error if not a date', () => {
    assert.deepStrictEqual(
      date()('foo'),
      failure(leafError('foo', 'Not a date.'))
    )
  })

  it('should return an error if not a valid date', () => {
    const value = new Date('foo')
    assert.deepStrictEqual(
      date()(value),
      failure(leafError(value, 'Not a valid date.'))
    )
  })

  it('should return an error if before min', () => {
    const validate = date({ min: new Date('2018-10-22T00:00:00.000Z') })
    const value = new Date('2018-10-21T00:00:00.000Z')
    assert.deepStrictEqual(
      validate(value),
      failure(leafError(value, 'Before 2018-10-22T00:00:00.000Z.'))
    )
  })

  it('should return an error if after max', () => {
    const validate = date({ max: new Date('2018-10-22T00:00:00.000Z') })
    const value = new Date('2018-10-23T00:00:00.000Z')
    assert.deepStrictEqual(
      validate(value),
      failure(leafError(value, 'After 2018-10-22T00:00:00.000Z.'))
    )
  })

  it('return a valid date', () => {
    const validate = date({
      min: new Date('2018-10-20T00:00:00.000Z'),
      max: new Date('2018-10-22T00:00:00.000Z'),
    })
    const value = new Date('2018-10-21T00:00:00.000Z')
    assert.deepStrictEqual(validate(value), success(value))
  })
})

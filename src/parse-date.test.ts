import { assert } from 'chai'

import { leafError } from './errors'
import { failure, success } from './result'
import { parseDate } from './parse-date'

describe('parseDate()', () => {
  it('should return an error if not a date', () =>
    assert.deepStrictEqual(
      parseDate()('foo'),
      failure(leafError('foo', 'Not a date.'))
    ))

  it('should return an error if not an ISO date string', () => {
    const value = '2018-10-22T09:40:40'
    assert.deepStrictEqual(
      parseDate({ iso: true })(value),
      failure(leafError(value, 'Not an ISO 8601 date string.'))
    )
  })

  it('should parse an ISO date string without milliseconds', () => {
    const value = '2018-10-22T09:40:40Z'
    const parsedDate = parseDate({ iso: true })(value)
    assert.deepStrictEqual(parsedDate, success(new Date(value)))
  })

  it('return parsed date', () => {
    const date = new Date()
    const parsedDate = parseDate({ iso: true })(date.toISOString())
    assert.deepStrictEqual(parsedDate, success(date))
  })
})

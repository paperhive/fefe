import { expect } from 'chai'

import { FefeError } from '../errors'
import { parseDate } from './parse-date'

describe('parseDate()', () => {
  it('should throw if not a date', () => {
    expect(() => parseDate()('foo'))
      .to.throw(FefeError, 'Not a date.')
  })

  it('should throw if not an ISO date string', () => {
    expect(() => parseDate({ iso: true })('2018-10-22T09:40:40'))
      .to.throw(FefeError, 'Not an ISO 8601 date string.')
  })

  it('return parsed date', () => {
    const date = new Date()
    const parsedDate = parseDate({ iso: true })(date.toISOString())
    expect(parsedDate.getTime()).to.equal(date.getTime())
  })
})

import { expect } from 'chai'

import { FefeError } from '../errors'
import { validateDate } from './validate-date'

describe('validateDate()', () => {
  it('should throw if not a date', () => {
    expect(() => validateDate()('foo'))
      .to.throw(FefeError, 'Not a date.')
  })

  it('should throw if not a valid date', () => {
    expect(() => validateDate()(new Date('foo')))
      .to.throw(FefeError, 'Not a valid date.')
  })

  it('should throw if before min', () => {
    const validate = validateDate({ min: new Date('2018-10-22T00:00:00.000Z') })
    expect(() => validate(new Date('2018-10-21T00:00:00.000Z')))
      .to.throw(FefeError, 'Before 2018-10-22T00:00:00.000Z.')
  })

  it('should throw if after max', () => {
    const validate = validateDate({ max: new Date('2018-10-22T00:00:00.000Z') })
    expect(() => validate(new Date('2018-10-23T00:00:00.000Z')))
      .to.throw(FefeError, 'After 2018-10-22T00:00:00.000Z.')
  })

  it('return a valid date', () => {
    const validate = validateDate({
      min: new Date('2018-10-20T00:00:00.000Z'),
      max: new Date('2018-10-22T00:00:00.000Z')
    })
    const date = new Date('2018-10-21T00:00:00.000Z')
    expect(validate(date)).to.equal(date)
  })
})

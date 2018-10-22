import { expect } from 'chai'

import { FefeError } from '../errors'
import { validateNumber } from './validate-number'

describe('validateNumber()', () => {
  it('should throw if not a number', () => {
    expect(() => validateNumber()('foo'))
      .to.throw(FefeError, 'Not a number.')
  })

  it('should throw if NaN', () => {
    expect(() => validateNumber()(1 / 0 - 1 / 0))
      .to.throw(FefeError, 'NaN is not allowed.')
  })

  it('should throw if infinite', () => {
    expect(() => validateNumber()(1 / 0))
      .to.throw(FefeError, 'Infinity is not allowed.')
  })

  it('should throw if less than min', () => {
    expect(() => validateNumber({ min: 0 })(-1))
      .to.throw(FefeError, 'Less than 0.')
  })

  it('should throw if less than max', () => {
    expect(() => validateNumber({ max: 0 })(11))
      .to.throw(FefeError, 'Greater than 0.')
  })

  it('return a valid number', () => {
    expect(validateNumber({ min: 0, max: 2 })(1)).to.equal(1)
  })
})

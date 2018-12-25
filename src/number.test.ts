import { expect } from 'chai'

import { FefeError } from './errors'
import { number } from './number'

describe('number()', () => {
  it('should throw if not a number', () => {
    expect(() => number()('foo'))
      .to.throw(FefeError, 'Not a number.')
  })

  it('should throw if NaN', () => {
    expect(() => number()(1 / 0 - 1 / 0))
      .to.throw(FefeError, 'NaN is not allowed.')
  })

  it('should throw if infinite', () => {
    expect(() => number()(1 / 0))
      .to.throw(FefeError, 'Infinity is not allowed.')
  })

  it('should throw if not integer', () => {
    expect(() => number({ integer: true })(1.5))
      .to.throw(FefeError, 'Not an integer.')
  })

  it('should throw if less than min', () => {
    expect(() => number({ min: 0 })(-1))
      .to.throw(FefeError, 'Less than 0.')
  })

  it('should throw if less than max', () => {
    expect(() => number({ max: 0 })(11))
      .to.throw(FefeError, 'Greater than 0.')
  })

  it('return a valid number', () => {
    expect(number({ min: 0, max: 2, integer: true })(1)).to.equal(1)
  })
})

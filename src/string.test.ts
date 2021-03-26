import { expect } from 'chai'

import { FefeError } from './errors'
import { string } from './string'

describe('string()', () => {
  it('should throw if not a string', () => {
    expect(() => string()(1)).to.throw(FefeError, 'Not a string.')
  })

  it('should throw if shorter than minLength', () => {
    expect(() => string({ minLength: 4 })('foo')).to.throw(
      FefeError,
      'Shorter than 4 characters.'
    )
  })

  it('should throw if longer than maxLength', () => {
    expect(() => string({ maxLength: 2 })('foo')).to.throw(
      FefeError,
      'Longer than 2 characters.'
    )
  })

  it('should throw if does not match regex', () => {
    expect(() => string({ regex: /foo/ })('bar')).to.throw(
      FefeError,
      'Does not match regex.'
    )
  })

  it('return a valid string', () => {
    expect(
      string({ minLength: 2, maxLength: 4, regex: /foo/ })('foo')
    ).to.equal('foo')
  })
})

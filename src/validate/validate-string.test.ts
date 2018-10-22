import { expect } from 'chai'

import { FefeError } from '../errors'
import { validateString } from './validate-string'

describe('validateString()', () => {
  it('should throw if not a string', () => {
    expect(() => validateString()(1))
      .to.throw(FefeError, 'Not a string.')
  })

  it('should throw if shorter than minLength', () => {
    expect(() => validateString({ minLength: 4 })('foo'))
      .to.throw(FefeError, 'Shorter than 4 characters.')
  })

  it('should throw if longer than maxLength', () => {
    expect(() => validateString({ maxLength: 2 })('foo'))
      .to.throw(FefeError, 'Longer than 2 characters.')
  })

  it('should throw if does not match regex', () => {
    expect(() => validateString({ regex: /foo/ })('bar'))
      .to.throw(FefeError, 'Does not match regex.')
  })

  it('return a valid string', () => {
    expect(validateString({ minLength: 2, maxLength: 4, regex: /foo/ })('foo'))
      .to.equal('foo')
  })
})

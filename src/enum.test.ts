import { expect } from 'chai'

import { FefeError } from './errors'
import { _enum } from './enum'

describe('enum()', () => {
  const validate = _enum('foo', 'bar')
  it('should throw if value is not in the list', () => {
    expect(() => validate('baz'))
      .to.throw(FefeError, 'Not one of foo, bar.')
    expect(() => validate(true))
      .to.throw(FefeError, 'Not one of foo, bar.')
  })

  it('return a valid value', () => {
    const validatedValue: 'foo' | 'bar' = validate('bar')
    expect(validatedValue).to.equal('bar')
  })
})

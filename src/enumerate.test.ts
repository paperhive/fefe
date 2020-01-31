import { expect } from 'chai'

import { FefeError } from './errors'
import { enumerate } from './enumerate'

describe('enumerate()', () => {
  const validate = enumerate('foo', 'bar')
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

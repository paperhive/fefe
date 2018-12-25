import { expect } from 'chai'

import { FefeError } from './errors'
import { array } from './array'
import { string } from './string'

describe('array()', () => {
  it('should throw if not a array', () => {
    const validate = array(string())
    expect(() => validate('foo'))
      .to.throw(FefeError, 'Not an array.')
      .that.deep.include({ value: 'foo', path: [], child: undefined })
  })

  it('should throw if nested validation fails', () => {
    const validate = array(string())
    const value = ['foo', 1]
    expect(() => validate(value))
      .to.throw(FefeError, 'Not a string.')
      .that.deep.include({ value, path: [1] })
  })

  it('should return a valid array', () => {
    const validate = array(string())
    const value = ['foo', 'bar']
    expect(validate(value)).to.eql(value)
  })

  it('should return a valid array with transformed values', () => {
    const validate = array(value => `transformed: ${string()(value)}`)
    expect(validate(['foo', 'bar'])).to.eql(['transformed: foo', 'transformed: bar'])
  })
})

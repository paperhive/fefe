import { expect } from 'chai'

import { FefeError } from '../errors'
import { validateArray } from './validate-array'
import { validateString } from './validate-string'

describe('validateArray()', () => {
  it('should throw if not a array', () => {
    const validate = validateArray({ elementValidate: validateString() })
    expect(() => validate('foo'))
      .to.throw(FefeError, 'Not an array.')
      .that.deep.include({ value: 'foo', path: [], child: undefined })
  })

  it('should throw if nested validation fails', () => {
    const validate = validateArray({ elementValidate: validateString() })
    const value = ['foo', 1]
    expect(() => validate(value))
      .to.throw(FefeError, 'Not a string.')
      .that.deep.include({ value, path: [1] })
  })

  it('should return a valid array', () => {
    const validate = validateArray({ elementValidate: validateString() })
    const value = ['foo', 'bar']
    expect(validate(value)).to.eql(value)
  })

  it('should return a valid array with transformed values', () => {
    const validate = validateArray({
      elementValidate: value => `transformed: ${validateString()(value)}`
    })
    expect(validate(['foo', 'bar'])).to.eql(['transformed: foo', 'transformed: bar'])
  })
})

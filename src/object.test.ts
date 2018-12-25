import { expect } from 'chai'

import { FefeError } from './errors'
import { object } from './object'
import { string } from './string'

describe('object()', () => {
  it('should throw if value is not an object', () => {
    const validate = object({})
    const error = expect(() => validate(null)).to.throw(FefeError, 'Not an object.')
      .that.deep.include({ value: null, path: [], child: undefined })
  })

  it('should throw if object has a missing key', () => {
    const validate = object({ foo: string() })
    const value = {}
    const error = expect(() => validate(value)).to.throw(FefeError, 'foo: Not a string.')
      .that.deep.include({ value , path: ['foo'] })
  })

  it('should throw if object has a value does not validate', () => {
    const validate = object({ foo: string() })
    const value = { foo: 1337 }
    const error = expect(() => validate(value)).to.throw(FefeError, 'foo: Not a string.')
      .that.deep.include({ value , path: ['foo'] })
  })

  it('should validate an object with shorthand notation', () => {
    const validate = object({ foo: string() })
    const result: { foo: string } = validate({ foo: 'bar' })
    expect(result).to.eql({ foo: 'bar' })
  })

  it('should validate an object with explicit notation', () => {
    const validate = object({ foo: { validator: string() } })
    const result: { foo: string } = validate({ foo: 'bar' })
    expect(result).to.eql({ foo: 'bar' })
  })

  it('should validate an object with optional key', () => {
    const validate = object({ foo: { validator: string(), optional: true } })
    const result: { foo?: string } = validate({ foo: 'bar' })
    expect(result).to.eql({ foo: 'bar' })
    const emptyResult: { foo?: string } = validate({})
    expect(emptyResult).to.eql({})
  })

  it('should validate an object with default value', () => {
    const validate = object({ foo: { validator: string(), default: 'bar' } })
    const result: { foo: string } = validate({})
    expect(result).to.eql({ foo: 'bar' })
  })

  it('should validate an object with default value function', () => {
    const validate = object({ foo: { validator: string(), default: () => 'bar' } })
    const result: { foo: string } = validate({})
    expect(result).to.eql({ foo: 'bar' })
  })
})

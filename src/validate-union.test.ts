import { expect } from 'chai'

import { FefeError } from './errors'
import { validateBoolean } from './validate-boolean'
import { validateString } from './validate-string'
import { validateUnion } from './validate-union'

describe('validateUnion()', () => {
  const validate = validateUnion(validateBoolean(), validateString())

  it('should throw if all validators throw', () => {
    expect(() => validate(1)).to.throw(FefeError, 'Not of any expected type.')
  })

  it('should validate either type', () => {
    const booleanResult: boolean | string = validate(false)
    expect(booleanResult).to.equal(false)
    const stringResult: boolean | string = validate('foo')
    expect(stringResult).to.equal('foo')
  })
})

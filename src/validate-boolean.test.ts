import { expect } from 'chai'

import { FefeError } from './errors'
import { validateBoolean } from './validate-boolean'

describe('validateBoolean()', () => {
  it('should throw if not a boolean', () => {
    expect(() => validateBoolean()('foo'))
      .to.throw(FefeError, 'Not a boolean.')
  })

  it('return a valid boolean', () => expect(validateBoolean()(true)).to.equal(true))
})

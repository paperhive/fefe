import { expect } from 'chai'

import { FefeError } from './errors'
import { boolean } from './boolean'

describe('boolean()', () => {
  it('should throw if not a boolean', () => {
    expect(() => boolean()('foo')).to.throw(FefeError, 'Not a boolean.')
  })

  it('return a valid boolean', () => expect(boolean()(true)).to.equal(true))
})

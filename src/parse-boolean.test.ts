import { expect } from 'chai'

import { FefeError } from './errors'
import { parseBoolean } from './parse-boolean'

describe('parseBoolean()', () => {
  it('should throw if not a boolean', () => {
    expect(() => parseBoolean()('foo')).to.throw(FefeError, 'Not a boolean.')
  })

  it('return parsed boolean', () => {
    expect(parseBoolean()('true')).to.equal(true)
    expect(parseBoolean()('false')).to.equal(false)
  })
})

import { expect } from 'chai'

import { FefeError } from '../errors'
import { parseNumber } from './parse-number'

describe('parseNumber()', () => {
  it('should throw if not a number', () => {
    expect(() => parseNumber()('foo'))
      .to.throw(FefeError, 'Not a number.')
  })

  it('return parsed number', () => expect(parseNumber()('0.5')).to.equal(0.5))
})

import { expect } from 'chai'

import { FefeError } from './errors'
import { parseJson } from './parse-json'

describe('parseJson()', () => {
  it('should throw if not JSON', () => {
    expect(() => parseJson()('{foo}'))
      .to.throw(FefeError, 'Invalid JSON')
  })

  it('return parsed JSON', () => {
    expect(parseJson()('{"foo":"bar"}')).to.eql({ foo: 'bar' })
  })
})

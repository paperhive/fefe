import { assert } from 'chai'

import { leafError } from './errors'
import { failure, success } from './result'
import { parseJson } from './parse-json'

describe('parseJson()', () => {
  it('should throw if not JSON', () =>
    assert.deepStrictEqual(
      parseJson()('foo'),
      failure(
        leafError(
          'foo',
          'Invalid JSON: Unexpected token o in JSON at position 1.'
        )
      )
    ))

  it('return parsed JSON', () =>
    assert.deepStrictEqual(
      parseJson()('{"foo":"bar"}'),
      success({ foo: 'bar' })
    ))
})

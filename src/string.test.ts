import { assert } from 'chai'

import { leafError } from './errors'
import { string } from './string'
import { failure, success } from './result'

describe('string()', () => {
  it('should return an error if not a string', () => {
    assert.deepStrictEqual(string()(1), failure(leafError(1, 'Not a string.')))
  })

  it('should return an error if shorter than minLength', () => {
    assert.deepStrictEqual(
      string({ minLength: 4 })('foo'),
      failure(leafError('foo', 'Shorter than 4 characters.'))
    )
  })

  it('should return an error if longer than maxLength', () => {
    assert.deepStrictEqual(
      string({ maxLength: 2 })('foo'),
      failure(leafError('foo', 'Longer than 2 characters.'))
    )
  })

  it('should return an error if does not match regex', () => {
    assert.deepStrictEqual(
      string({ regex: /foo/ })('bar'),
      failure(leafError('bar', 'Does not match regex.'))
    )
  })

  it('return a valid string', () => {
    assert.deepStrictEqual(
      string({ minLength: 2, maxLength: 4, regex: /foo/ })('foo'),
      success('foo')
    )
  })
})

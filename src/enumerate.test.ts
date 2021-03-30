import { assert } from 'chai'

import { leafError } from './errors'
import { enumerate } from './enumerate'
import { failure, Result, success } from './result'

describe('enumerate()', () => {
  const validate = enumerate('foo', 'bar')

  it('should return an error if value is not in the list', () => {
    assert.deepStrictEqual(
      validate('baz'),
      failure(leafError('baz', 'Not one of foo, bar.'))
    )
    assert.deepStrictEqual(
      validate(true),
      failure(leafError(true, 'Not one of foo, bar.'))
    )
  })

  it('return a valid value', () => {
    const result: Result<'foo' | 'bar'> = validate('bar')
    assert.deepStrictEqual(result, success('bar'))
  })
})

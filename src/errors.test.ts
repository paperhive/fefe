import { assert } from 'chai'

import {
  branchError,
  leafError,
  getLeafErrorReasons,
  getErrorString,
  FefeError,
} from './errors'

const error: FefeError = branchError({ id: 'c0ff33', emails: ['hurz'] }, [
  { key: 'id', error: leafError('c0ff33', 'Not a number.') },
  {
    key: 'emails',
    error: branchError(
      ['hurz'],
      [{ key: 0, error: leafError('hurz', 'Not an email address.') }]
    ),
  },
])

describe('getLeafErrorReasons()', () => {
  it('should return leaf error reasons', () =>
    assert.deepStrictEqual(getLeafErrorReasons(error), [
      { path: ['id'], reason: 'Not a number.' },
      { path: ['emails', 0], reason: 'Not an email address.' },
    ]))
})

describe('getErrorString()', () => {
  it('should return an error string', () =>
    assert.equal(
      getErrorString(error),
      'id: Not a number. emails.0: Not an email address.'
    ))
})

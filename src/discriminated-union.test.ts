import { assert } from 'chai'

import { branchError, leafError } from './errors'
import { failure, success } from './result'
import { discriminatedUnion } from './discriminated-union'
import { number } from './number'
import { optional } from './object'

describe('discriminatedUnion()', () => {
  const validateVehicle = discriminatedUnion('type', {
    person: { age: number(), height: optional(number()) },
    robot: { battery: number() },
  })

  it('should return an error if not an object', () =>
    assert.deepStrictEqual(
      validateVehicle(1),
      failure(leafError(1, 'Not an object.'))
    ))

  it('should return an error if type does not exist.', () => {
    const value = { type: 'cat', age: 12 }
    assert.deepStrictEqual(
      validateVehicle(value),
      failure(
        branchError(value, [
          { key: 'type', error: leafError('cat', 'Not one of person, robot.') },
        ])
      )
    )
  })

  it('should return an error if key does not exist for type.', () => {
    const value = { type: 'robot', age: 12 }
    assert.deepStrictEqual(
      validateVehicle(value),
      failure(leafError(value, 'Properties not allowed: age.'))
    )
  })

  it('should return an error if key does not validate.', () => {
    const value = { type: 'person', age: 'foo' }
    assert.deepStrictEqual(
      validateVehicle(value),
      failure(
        branchError(value, [
          { key: 'age', error: leafError('foo', 'Not a number.') },
        ])
      )
    )
  })

  it('should validate a person and a robot', () => {
    assert.deepStrictEqual(
      validateVehicle({ type: 'person', age: 2 }),
      success({ type: 'person' as const, age: 2 })
    )
    assert.deepStrictEqual(
      validateVehicle({ type: 'person', age: 2, height: 180 }),
      success({ type: 'person' as const, age: 2, height: 180 })
    )
    assert.deepStrictEqual(
      validateVehicle({ type: 'robot', battery: 99 }),
      success({ type: 'robot' as const, battery: 99 })
    )
  })
})

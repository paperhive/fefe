import { partitionMap, traverse } from 'fp-ts/lib/Array'
import { Either, either, isLeft, left, right } from 'fp-ts/lib/Either'
import { branchError, ChildError, success } from '.'
import { leafError } from './errors'
import { failure } from './result'
import { Validator } from './transformer'

export interface ObjectMapOptions {
  allErrors?: boolean
}

export function objectMap<R>(
  valueValidator: Validator<R>,
  { allErrors }: ObjectMapOptions = {}
): Validator<{ [k in string]?: R }> {
  function validateEntry([key, v]: [string, unknown]): Either<
    ChildError,
    [string, R]
  > {
    const result = valueValidator(v)
    if (isLeft(result)) return left({ key, error: result.left })
    return right([key, result.right])
  }

  return (value) => {
    if (typeof value !== 'object' || value === null)
      return failure(leafError(value, 'Not an object.'))

    const entries = Object.entries(value)

    if (allErrors) {
      const results = partitionMap(validateEntry)(entries)
      if (results.left.length > 0)
        return failure(branchError(value, results.left))
      return success(Object.fromEntries(results.right))
    }

    const result = traverse(either)(validateEntry)(entries)
    if (isLeft(result)) return failure(branchError(value, [result.left]))
    return success(Object.fromEntries(result.right))
  }
}

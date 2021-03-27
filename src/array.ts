import { partitionMapWithIndex, traverseWithIndex } from 'fp-ts/lib/Array'
import { either, isLeft, left } from 'fp-ts/Either'

import { branchError, leafError } from './errors'
import { failure, isFailure, success } from './result'
import { Validator2 } from './validate'

export interface ArrayOptions {
  minLength?: number
  maxLength?: number
  allErrors?: boolean
}

export function array<R>(
  elementValidator: Validator2<R>,
  { minLength, maxLength, allErrors }: ArrayOptions = {}
): Validator2<R[]> {
  const validate = (index: number, element: unknown) => {
    const result = elementValidator(element)
    if (isFailure(result)) return left({ key: index, error: result.left })
    return result
  }
  return (value: unknown) => {
    if (!Array.isArray(value)) return failure(leafError(value, 'Not an array.'))
    if (minLength !== undefined && value.length < minLength)
      return failure(leafError(value, `Has less than ${minLength} elements.`))
    if (maxLength !== undefined && value.length > maxLength)
      return failure(leafError(value, `Has more than ${maxLength} elements.`))

    if (allErrors) {
      const results = partitionMapWithIndex(validate)(value)

      if (results.left.length > 0)
        return failure(branchError(value, results.left))
      return success(results.right)
    }

    const result = traverseWithIndex(either)(validate)(value)
    if (isLeft(result)) return failure(branchError(value, [result.left]))
    return success(result.right)
  }
}

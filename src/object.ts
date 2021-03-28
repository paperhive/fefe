import { partitionMap, traverse } from 'fp-ts/lib/Array'
import { either, Either, isLeft, left, right } from 'fp-ts/lib/Either'
import { branchError, ChildError2, leafError } from './errors'
import { failure, isFailure, success } from './result'
import { Validator2, Validator2ReturnType } from './validate'

export type ObjectDefinition = Record<string, Validator2<unknown>>

type FilterObject<T, C> = { [k in keyof T]: C extends T[k] ? k : never }
type MatchingKeys<T, C> = FilterObject<T, C>[keyof T]
type NotFilterObject<T, C> = { [k in keyof T]: C extends T[k] ? never : k }
type NonMatchingKeys<T, C> = NotFilterObject<T, C>[keyof T]

type MandatoryKeys<D> = NonMatchingKeys<D, Validator2<undefined>>
type OptionalKeys<D> = MatchingKeys<D, Validator2<undefined>>

export type ObjectResult<D> = {
  [k in MandatoryKeys<D>]: Validator2ReturnType<D[k]>
} &
  { [k in OptionalKeys<D>]?: Validator2ReturnType<D[k]> }

export interface ObjectOptions {
  allowExcessProperties?: boolean
  allErrors?: boolean
}

export function object<D extends ObjectDefinition>(
  definition: D,
  { allowExcessProperties = false, allErrors = false }: ObjectOptions = {}
): Validator2<ObjectResult<D>> {
  function getEntryValidator(value: Record<string | number | symbol, unknown>) {
    return <K extends keyof D>([key, validator]: [
      K,
      Validator2<unknown>
    ]): Either<ChildError2, [K, Validator2ReturnType<D[K]>]> => {
      const result = validator(value[key])
      if (isFailure(result)) return left({ key, error: result.left })
      return right([key, result.right as Validator2ReturnType<D[K]>])
    }
  }

  function createObjectFromEntries(
    entries: [keyof D, Validator2ReturnType<D[keyof D]>][]
  ) {
    return Object.fromEntries(
      entries.filter(([, v]) => v !== undefined)
    ) as ObjectResult<D>
  }

  return (value: unknown) => {
    if (typeof value !== 'object' || value === null)
      return failure(leafError(value, 'Not an object.'))

    if (!allowExcessProperties) {
      const excessProperties = Object.keys(value).filter(
        (key) => !definition[key]
      )
      if (excessProperties.length > 0)
        return failure(
          leafError(
            value,
            `Properties not allowed: ${excessProperties.join(', ')}`
          )
        )
    }

    const entries = Object.entries(definition)
    const validateEntry = getEntryValidator(
      value as Record<string | number | symbol, unknown>
    )

    if (allErrors) {
      const results = partitionMap(validateEntry)(entries)
      if (results.left.length > 0)
        return failure(branchError(value, results.left))
      return success(createObjectFromEntries(results.right))
    }

    const result = traverse(either)(validateEntry)(entries)
    if (isLeft(result)) return failure(branchError(value, [result.left]))
    return success(createObjectFromEntries(result.right))
  }
}

export function defaultTo<T, D>(
  validator: Validator2<T>,
  _default: D | (() => D)
): Validator2<T | D> {
  return (value: unknown) => {
    if (value !== undefined) return validator(value)
    return success(_default instanceof Function ? _default() : _default)
  }
}

export function optional<T>(
  validator: Validator2<T>
): Validator2<T | undefined> {
  return defaultTo(validator, undefined)
}

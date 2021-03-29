import { partitionMap, traverse } from 'fp-ts/lib/Array'
import { either, Either, isLeft, left, right } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { branchError, ChildError2, leafError } from './errors'
import { failure, isFailure, success } from './result'
import { Validator, ValidatorReturnType } from './validate'

export type ObjectValueValidator = Validator<unknown> & { optional?: boolean }
export type ObjectDefinition = Record<string, ObjectValueValidator>

type FilterObject<T, C> = { [k in keyof T]: T[k] extends C ? k : never }
type MatchingKeys<T, C> = FilterObject<T, C>[keyof T]
type NotFilterObject<T, C> = { [k in keyof T]: T[k] extends C ? never : k }
type NonMatchingKeys<T, C> = NotFilterObject<T, C>[keyof T]

type MandatoryKeys<D> = NonMatchingKeys<D, { optional: true }>
type OptionalKeys<D> = MatchingKeys<D, { optional: true }>

export type ObjectResult<D> = {
  [k in MandatoryKeys<D>]: ValidatorReturnType<D[k]>
} &
  { [k in OptionalKeys<D>]?: ValidatorReturnType<D[k]> }

export interface ObjectOptions {
  allowExcessProperties?: boolean
  allErrors?: boolean
}

type ValidatedEntry<K, T> =
  | { type: 'mandatory'; key: K; value: T }
  | { type: 'optional'; key: K }

export function object<D extends ObjectDefinition>(
  definition: D,
  { allowExcessProperties = false, allErrors = false }: ObjectOptions = {}
): Validator<ObjectResult<D>> {
  function getEntryValidator(value: Record<string | number | symbol, unknown>) {
    return <K extends keyof D>([key, validator]: [
      K,
      ObjectValueValidator
    ]): Either<ChildError2, ValidatedEntry<K, ValidatorReturnType<D[K]>>> => {
      if (validator.optional && (!(key in value) || value[key] === undefined))
        return right({ type: 'optional', key })
      const result = validator(value[key])
      if (isFailure(result)) return left({ key, error: result.left })
      return right({
        type: 'mandatory',
        key,
        value: result.right as ValidatorReturnType<D[K]>,
      })
    }
  }

  function createObjectFromEntries(
    entries: ValidatedEntry<keyof D, ValidatorReturnType<D[keyof D]>>[]
  ) {
    return pipe(
      entries,
      partitionMap(
        (entry: ValidatedEntry<keyof D, ValidatorReturnType<D[keyof D]>>) =>
          entry.type === 'optional'
            ? left(entry.key)
            : right([entry.key, entry.value] as [
                keyof D,
                ValidatorReturnType<D[keyof D]>
              ])
      ),
      ({ right }) => Object.fromEntries(right) as ObjectResult<D>
    )
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
            `Properties not allowed: ${excessProperties.join(', ')}.`
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
  validator: Validator<T>,
  _default: D | (() => D)
): Validator<T | D> {
  return (value: unknown) => {
    if (value !== undefined) return validator(value)
    return success(_default instanceof Function ? _default() : _default)
  }
}

export function optional<T>(
  validator: Validator<T>
): Validator<T> & { optional: true } {
  const validate = ((v: unknown) => validator(v)) as Validator<T> & {
    optional: true
  }
  validate.optional = true
  return validate
}

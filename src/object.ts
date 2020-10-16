import { FefeError } from './errors'
import { Validator } from './validate'

export interface ObjectOptions<R> {
  validator: Validator<R>
  optional?: boolean
  default?: R | (() => R)
}

export type ObjectDefinitionValue<R> = Validator<R> | ObjectOptions<R>

export type ObjectDefinition = Record<string, ObjectDefinitionValue<any>>

export type ObjectReturnType<T> = T extends ObjectDefinitionValue<infer U>
  ? U
  : never

type FilterObject<T, C> = { [k in keyof T]: T[k] extends C ? k : never}
type MatchingKeys<T, C> = FilterObject<T, C>[keyof T]
type NotFilterObject<T, C> = { [k in keyof T]: T[k] extends C ? never : k}
type NonMatchingKeys<T, C> = NotFilterObject<T, C>[keyof T]

type MandatoryKeys<D> = NonMatchingKeys<D, {optional: true}>
type OptionalKeys<D> = MatchingKeys<D, {optional: true}>

export type ObjectResult<D> =
  { [k in MandatoryKeys<D>]: ObjectReturnType<D[k]> } &
  { [k in OptionalKeys<D>]?: ObjectReturnType<D[k]> }

export function object<D extends ObjectDefinition> (
  definition: D,
  { allowExcessProperties = false }: { allowExcessProperties?: boolean } = {}
) {
  Object.entries(definition).forEach(([key, definitionValue]) => {
    if (typeof definitionValue !== 'object') return
    if (definitionValue.default !== undefined && definitionValue.optional) {
      throw new Error('default and optional cannot be used together')
    }
  })

  return (value: unknown) => {
    // note: type 'object' includes null
    // tslint:disable-next-line:strict-type-predicates
    if (typeof value !== 'object' || value === null) throw new FefeError(value, 'Not an object.')

    if (!allowExcessProperties) {
      const excessProperties = Object.keys(value).filter(key => !definition[key])
      if (excessProperties.length > 0) throw new FefeError(value, `Properties not allowed: ${excessProperties.join(', ')}`)
    }

    const validated = {} as ObjectResult<D>

    Object.entries(definition).forEach(([key, definitionValue]: [string, ObjectDefinitionValue<any>]) => {
      const options: ObjectOptions<any> = typeof definitionValue === 'object' ?
        definitionValue :
        { validator: definitionValue }

      const currentValue: unknown = (value as any)[key]

      // tslint:disable-next-line:strict-type-predicates
      if (currentValue === undefined) {
        if (options.default !== undefined) {
          validated[key as keyof typeof validated] = typeof options.default === 'function' ? options.default() : options.default
          return
        }

        if (options.optional) {
          return
        }
      }
      try {
        validated[key as keyof typeof validated] = options.validator(currentValue)
      } catch (error) {
        if (error instanceof FefeError) {
          throw error.createParentError(value, key)
        }
        throw error
      }
    })
    return validated
  }
}

export function defaultTo<R> (validator: Validator<R>, _default: R | (() => R)): ObjectOptions<R> {
  return {
    validator,
    default: _default
  }
}

export function optional<R> (validator: Validator<R>): {validator: Validator<R>, optional: true} {
  return {
    validator,
    optional: true
  }
}

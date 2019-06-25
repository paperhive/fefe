import { FefeError } from './errors'
import { Validator } from './validate'

export interface ObjectOptions<R> {
  validator: Validator<R>
  optional?: boolean
  default?: R | (() => R)
}

export type ObjectDefinitionValue<R> = Validator<R> | ObjectOptions<R>

export type ObjectDefinition = Record<string, ObjectDefinitionValue<any>>

type ObjectReturnType<T> = T extends ObjectDefinitionValue<infer U>
  ? U | (T extends {optional: true} ? undefined : never)
  : never

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

    const validated = {} as {[k in keyof D]: ObjectReturnType<D[k]>}
    Object.entries(definition).forEach(([key, definitionValue]: [keyof D, ObjectDefinitionValue<any>]) => {
      const options: ObjectOptions<any> = typeof definitionValue === 'object' ?
        definitionValue :
        { validator: definitionValue }

      const currentValue: unknown = (value as any)[key]

      // tslint:disable-next-line:strict-type-predicates
      if (currentValue === undefined) {
        if (options.default !== undefined) {
          validated[key] = typeof options.default === 'function' ? options.default() : options.default
          return
        }

        if (options.optional) {
          return
        }
      }
      try {
        validated[key] = options.validator(currentValue)
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

export function optional<R> (validator: Validator<R>): ObjectOptions<R> {
  return {
    validator,
    optional: true
  }
}

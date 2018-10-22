import { FefeError } from '../errors'
import { Validate } from './validate'

export interface ValidateObjectOptions<R> {
  validate: Validate<R>
  optional?: boolean
  default?: R | (() => R)
}

export type ValidateObjectDefinitionValue<R> = Validate<R> | ValidateObjectOptions<R>

export type ValidateObjectDefinition = Record<string, ValidateObjectDefinitionValue<any>>

type ValidateObjectReturnType<T> = T extends ValidateObjectDefinitionValue<infer U>
  ? U | (T extends {optional: true} ? undefined : never)
  : never

export function validateObject<D extends ValidateObjectDefinition> (
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

    const validated = {} as {[k in keyof D]: ValidateObjectReturnType<D[k]>}
    Object.entries(definition).forEach(([key, definitionValue]) => {
      const options: ValidateObjectOptions<any> = typeof definitionValue === 'object' ?
        definitionValue :
        { validate: definitionValue }

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
        validated[key] = options.validate(currentValue)
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

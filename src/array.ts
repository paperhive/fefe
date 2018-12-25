import { FefeError } from './errors'
import { Validator } from './validate'

export interface ArrayOptions<R> {
  minLength?: number
  maxLength?: number
}

export function array<R> (
  elementValidator: Validator<R>,
  { minLength, maxLength }: ArrayOptions<R> = {}): (value: unknown) => R[] {

  return (value: unknown) => {
    if (!Array.isArray(value)) throw new FefeError(value, 'Not an array.')
    if (minLength !== undefined && value.length < minLength) throw new FefeError(value, `Has less than ${minLength} elements.`)
    if (maxLength !== undefined && value.length > maxLength) throw new FefeError(value, `Has more than ${maxLength} elements.`)

    return value.map((element, index) => {
      try {
        return elementValidator(element)
      } catch (error) {
        if (error instanceof FefeError) {
          throw error.createParentError(value, index)
        }
        throw error
      }
    })
  }
}

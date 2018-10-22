import { FefeError } from '../errors'
import { Validate } from './validate'

export interface ValidateArrayOptions<R> {
  minLength?: number
  maxLength?: number
}

export type ValidateArrayValue<R> = Validate<R> | ValidateArrayOptions<R>

export function validateArray<R> (
  elementValidate: Validate<R>,
  { minLength, maxLength }: ValidateArrayOptions<R> = {}): (value: unknown) => R[] {

  return (value: unknown) => {
    if (!Array.isArray(value)) throw new FefeError(value, 'Not an array.')
    if (minLength !== undefined && value.length < minLength) throw new FefeError(value, `Has less than ${minLength} elements.`)
    if (maxLength !== undefined && value.length > maxLength) throw new FefeError(value, `Has more than ${maxLength} elements.`)

    return value.map((element, index) => {
      try {
        return elementValidate(element)
      } catch (error) {
        if (error instanceof FefeError) {
          throw error.createParentError(value, index)
        }
        throw error
      }
    })
  }
}

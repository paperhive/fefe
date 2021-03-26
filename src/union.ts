import { FefeError } from './errors'
import { Validator } from './validate'

export function union<T extends Validator<unknown>[]>(...validators: T) {
  return (value: unknown): ReturnType<T[number]> => {
    const errors: FefeError[] = []
    for (const validator of validators) {
      try {
        return validator(value) as ReturnType<T[number]>
      } catch (error) {
        if (error instanceof FefeError) {
          errors.push(error)
        } else {
          throw error
        }
      }
    }
    throw new FefeError(value, 'Not of any expected type.')
  }
}

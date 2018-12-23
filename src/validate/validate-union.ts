import { FefeError } from '../errors'

export function validateUnion<T extends any[]> (...validators: T) {
  return (value: unknown): ReturnType<T[number]> => {
    const errors: FefeError[] = []
    for (const validator of validators) {
      try {
        return validator(value)
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

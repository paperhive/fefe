import { FefeError } from '../errors'

export function validateDate () {
  return (value: unknown): Date => {
    if (!(value instanceof Date)) throw new FefeError(value, 'Not a date.')
    if (isNaN(value.getTime())) throw new FefeError(value, 'Not a valid date.')
    return value
  }
}

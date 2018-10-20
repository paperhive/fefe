import { FefeError } from '../errors'

export function validateDate () {
  return (value: unknown) => {
    if (value instanceof Date) throw new FefeError(value, 'Not a date.')
    return value
  }
}

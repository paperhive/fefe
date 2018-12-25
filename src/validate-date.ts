import { FefeError } from './errors'

export interface ValidateDateOptions {
  min?: Date
  max?: Date
}

export function validateDate ({ min, max }: ValidateDateOptions = {}) {
  return (value: unknown): Date => {
    if (!(value instanceof Date)) throw new FefeError(value, 'Not a date.')
    if (isNaN(value.getTime())) throw new FefeError(value, 'Not a valid date.')
    if (min !== undefined && value.getTime() < min.getTime()) throw new FefeError(value, `Before ${min.toISOString()}.`)
    if (max !== undefined && value.getTime() > max.getTime()) throw new FefeError(value, `After ${max.toISOString()}.`)
    return value
  }
}

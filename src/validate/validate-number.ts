import { FefeError } from '../errors'

export function validateNumber (
  { min, max }: { min?: number, max?: number } = {}
) {
  return (value: unknown) => {
    // tslint:disable-next-line:strict-type-predicates
    if (typeof value !== 'number' || Number.isNaN(value)) throw new FefeError(value, 'Not a number.')
    if (min !== undefined && value < min) throw new FefeError(value, `Less than ${min}.`)
    if (max !== undefined && value > max) throw new FefeError(value, `Greater than ${max}.`)
    return value
  }
}

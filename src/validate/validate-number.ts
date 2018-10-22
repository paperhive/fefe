import { FefeError } from '../errors'

export function validateNumber (
  { min, max, allowNaN = false, allowInfinity = false }:
  { min?: number, max?: number, allowNaN?: boolean, allowInfinity?: boolean} = {}
) {
  return (value: unknown) => {
    // tslint:disable-next-line:strict-type-predicates
    if (typeof value !== 'number') throw new FefeError(value, 'Not a number.')
    if (!allowNaN && Number.isNaN(value)) throw new FefeError(value, 'NaN is not allowed.')
    if (!allowInfinity && !Number.isFinite(value)) throw new FefeError(value, 'Infinity is not allowed.')
    if (min !== undefined && value < min) throw new FefeError(value, `Less than ${min}.`)
    if (max !== undefined && value > max) throw new FefeError(value, `Greater than ${max}.`)
    return value
  }
}

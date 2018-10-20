import { FefeError } from '../errors'

export function validateString (
  { minLength, maxLength }:
  { minLength?: number, maxLength?: number } = {}
) {
  return (value: unknown) => {
    // tslint:disable-next-line:strict-type-predicates
    if (typeof value !== 'string') throw new FefeError(value, 'Not a string.')
    if (minLength !== undefined && value.length < minLength) throw new FefeError(value, `Shorter than ${minLength}.`)
    if (maxLength !== undefined && value.length > maxLength) throw new FefeError(value, `Longer than ${maxLength}.`)
    return value
  }
}

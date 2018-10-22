import { FefeError } from '../errors'

export function validateString (
  { minLength, maxLength, regex }:
  { minLength?: number, maxLength?: number, regex?: RegExp } = {}
) {
  return (value: unknown) => {
    // tslint:disable-next-line:strict-type-predicates
    if (typeof value !== 'string') throw new FefeError(value, 'Not a string.')
    if (minLength !== undefined && value.length < minLength) throw new FefeError(value, `Shorter than ${minLength} characters.`)
    if (maxLength !== undefined && value.length > maxLength) throw new FefeError(value, `Longer than ${maxLength} characters.`)
    if (regex !== undefined && !regex.test(value)) throw new FefeError(value, 'Does not match regex.')
    return value
  }
}

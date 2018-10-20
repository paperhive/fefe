import { FefeError } from '../errors'

export function validateBoolean () {
  return (value: unknown) => {
    // tslint:disable-next-line:strict-type-predicates
    if (typeof value !== 'boolean') throw new FefeError(value, 'Not a boolean.')
    return value
  }
}

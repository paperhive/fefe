import { FefeError } from './errors'

export function boolean() {
  return (value: unknown): boolean => {
    // tslint:disable-next-line:strict-type-predicates
    if (typeof value !== 'boolean') throw new FefeError(value, 'Not a boolean.')
    return value
  }
}

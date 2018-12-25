import { FefeError } from './errors'

export function parseBoolean () {
  return (value: unknown) => {
    // tslint:disable-next-line:strict-type-predicates
    if (typeof value !== 'string') throw new FefeError(value, 'Not a string.')
    switch (value) {
      case 'true':
        return true
      case 'false':
        return false
      default:
        throw new FefeError(value, 'Not a boolean.')
    }
  }
}

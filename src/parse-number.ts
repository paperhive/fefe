import { FefeError } from './errors'

export function parseNumber () {
  return (value: unknown) => {
    // tslint:disable-next-line:strict-type-predicates
    if (typeof value !== 'string') throw new FefeError(value, 'Not a string.')
    const num = parseFloat(value)
    if (Number.isNaN(num)) throw new FefeError(value, 'Not a number.')
    return num
  }
}

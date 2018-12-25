import { FefeError } from './errors'

export function parseJson () {
  return (value: unknown) => {
    // tslint:disable-next-line:strict-type-predicates
    if (typeof value !== 'string') throw new FefeError(value, 'Not a string.')
    try {
      return JSON.parse(value)
    } catch (error) {
      throw new FefeError(value, `Invalid JSON: ${error.message}.`)
    }
  }
}

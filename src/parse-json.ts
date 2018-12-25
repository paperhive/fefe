import { FefeError } from './errors'

export function parseJson () {
  return (value: unknown) => {
    if (typeof value !== 'string') throw new FefeError(value, 'Not a string.')
    try {
      return JSON.parse(value)
    } catch (error) {
      throw new FefeError(value, `Invalid JSON: ${error.message}.`)
    }
  }
}

import { FefeError } from '../errors'

export function parseJson () {
  return (value: string) => {
    try {
      return JSON.parse(value)
    } catch (error) {
      throw new FefeError(value, `Invalid JSON: ${error.message}.`)
    }
  }
}

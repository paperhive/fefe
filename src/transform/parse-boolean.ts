import { FefeError } from '../errors'

export function parseBoolean () {
  return (value: string) => {
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

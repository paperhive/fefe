import { FefeError } from '../errors'

export function parseNumber () {
  return (value: string) => {
    const num = parseFloat(value)
    if (Number.isNaN(num)) throw new FefeError(value, 'Not a number.')
    return num
  }
}

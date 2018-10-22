import { FefeError } from '../errors'

const isoDateRegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/

export function parseDate ({ iso = false }: { iso?: boolean } = {}) {
  return (value: string) => {
    if (iso && !isoDateRegex.test(value)) throw new FefeError(value, 'Not an ISO 8601 date string.')
    const time = Date.parse(value)
    if (Number.isNaN(time)) throw new FefeError(value, 'Not a date.')
    return new Date(time)
  }
}

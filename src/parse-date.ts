import { LeafError, leafError } from './errors'
import { failure, success } from './result'
import { Transformer } from './transformer'

const isoDateRegex =
  /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)$/

export function parseDate({ iso = false }: { iso?: boolean } = {}): Transformer<
  string,
  Date,
  LeafError
> {
  return (value: string) => {
    if (iso && !isoDateRegex.test(value))
      return failure(leafError(value, 'Not an ISO 8601 date string.'))
    const time = Date.parse(value)
    if (Number.isNaN(time)) return failure(leafError(value, 'Not a date.'))
    return success(new Date(time))
  }
}

import { LeafError, leafError } from './errors'
import { failure, success } from './result'
import { Transformer } from './transformer'

export function parseNumber(): Transformer<string, number, LeafError> {
  return (value: string) => {
    const num = parseFloat(value)
    if (Number.isNaN(num)) return failure(leafError(value, 'Not a number.'))
    return success(num)
  }
}

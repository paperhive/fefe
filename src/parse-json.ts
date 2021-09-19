import { LeafError, leafError } from './errors'
import { failure, success } from './result'
import { Transformer } from './transformer'

export function parseJson(): Transformer<string, unknown, LeafError> {
  return (value: string) => {
    try {
      return success(JSON.parse(value))
    } catch (error) {
      return failure(
        leafError(value, `Invalid JSON: ${(error as Error).message}.`)
      )
    }
  }
}

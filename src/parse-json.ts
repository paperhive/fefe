import { leafError } from './errors'
import { failure, success } from './result'
import { Transformer } from './validate'

export function parseJson(): Transformer<string, unknown> {
  return (value: string) => {
    try {
      return success(JSON.parse(value))
    } catch (error) {
      return failure(leafError(value, `Invalid JSON: ${error.message}.`))
    }
  }
}

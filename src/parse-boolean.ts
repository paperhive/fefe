import { leafError } from './errors'
import { failure, success } from './result'
import { Transformer } from './validate'

export function parseBoolean(): Transformer<string, boolean> {
  return (value: string) => {
    switch (value) {
      case 'true':
        return success(true)
      case 'false':
        return success(false)
      default:
        return failure(leafError(value, 'Not a boolean.'))
    }
  }
}

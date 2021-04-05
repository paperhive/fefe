import { LeafError, leafError } from './errors'
import { failure, success } from './result'
import { Transformer } from './transformer'

export function parseBoolean(): Transformer<string, boolean, LeafError> {
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

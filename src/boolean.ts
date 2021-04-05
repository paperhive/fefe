import { LeafError, leafError } from './errors'
import { failure, success } from './result'
import { Validator } from './transformer'

export function boolean(): Validator<boolean, LeafError> {
  return (value: unknown) => {
    if (typeof value !== 'boolean')
      return failure(leafError(value, 'Not a boolean.'))
    return success(value)
  }
}

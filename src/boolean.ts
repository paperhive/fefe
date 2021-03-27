import { leafError } from './errors'
import { failure, success } from './result'
import { Validator2 } from './validate'

export function boolean(): Validator2<boolean> {
  return (value: unknown) => {
    if (typeof value !== 'boolean')
      return failure(leafError(value, 'Not a boolean.'))
    return success(value)
  }
}

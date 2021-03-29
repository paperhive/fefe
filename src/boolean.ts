import { leafError } from './errors'
import { failure, success } from './result'
import { Validator } from './validate'

export function boolean(): Validator<boolean> {
  return (value: unknown) => {
    if (typeof value !== 'boolean')
      return failure(leafError(value, 'Not a boolean.'))
    return success(value)
  }
}

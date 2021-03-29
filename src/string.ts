import { leafError } from './errors'
import { failure, success } from './result'
import { Validator } from './validate'

export interface StringOptions {
  minLength?: number
  maxLength?: number
  regex?: RegExp
}

export function string({
  minLength,
  maxLength,
  regex,
}: StringOptions = {}): Validator<string> {
  return (value: unknown) => {
    // tslint:disable-next-line:strict-type-predicates
    if (typeof value !== 'string')
      return failure(leafError(value, 'Not a string.'))
    if (minLength !== undefined && value.length < minLength)
      return failure(leafError(value, `Shorter than ${minLength} characters.`))
    if (maxLength !== undefined && value.length > maxLength)
      return failure(leafError(value, `Longer than ${maxLength} characters.`))
    if (regex !== undefined && !regex.test(value))
      return failure(leafError(value, 'Does not match regex.'))
    return success(value)
  }
}

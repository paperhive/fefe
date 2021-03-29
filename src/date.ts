import { leafError } from './errors'
import { failure, success } from './result'
import { Validator } from './validate'

export interface DateOptions {
  min?: Date
  max?: Date
}

export function date({ min, max }: DateOptions = {}): Validator<Date> {
  return (value: unknown) => {
    if (!(value instanceof Date))
      return failure(leafError(value, 'Not a date.'))
    if (isNaN(value.getTime()))
      return failure(leafError(value, 'Not a valid date.'))
    if (min !== undefined && value.getTime() < min.getTime())
      return failure(leafError(value, `Before ${min.toISOString()}.`))
    if (max !== undefined && value.getTime() > max.getTime())
      return failure(leafError(value, `After ${max.toISOString()}.`))
    return success(value)
  }
}

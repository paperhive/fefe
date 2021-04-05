import { LeafError, leafError } from './errors'
import { failure, success } from './result'
import { Validator } from './transformer'

export interface NumberOptions {
  min?: number
  max?: number
  integer?: boolean
  allowNaN?: boolean
  allowInfinity?: boolean
}

export function number({
  min,
  max,
  integer,
  allowNaN = false,
  allowInfinity = false,
}: NumberOptions = {}): Validator<number, LeafError> {
  return (value: unknown) => {
    if (typeof value !== 'number')
      return failure(leafError(value, 'Not a number.'))
    if (!allowNaN && Number.isNaN(value))
      return failure(leafError(value, 'NaN is not allowed.'))
    if (!allowInfinity && !Number.isFinite(value))
      return failure(leafError(value, 'Infinity is not allowed.'))
    if (integer && !Number.isInteger(value))
      return failure(leafError(value, 'Not an integer.'))
    if (min !== undefined && value < min)
      return failure(leafError(value, `Less than ${min}.`))
    if (max !== undefined && value > max)
      return failure(leafError(value, `Greater than ${max}.`))
    return success(value)
  }
}

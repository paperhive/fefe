import { leafError } from './errors'
import { failure, success } from './result'
import { Validator } from './transformer'

export function enumerate<T extends (string | number)[]>(
  ...args: T
): Validator<T[number]> {
  return (value: unknown) => {
    if (args.indexOf(value as T[number]) === -1)
      return failure(leafError(value, `Not one of ${args.join(', ')}.`))
    return success(value as T[number])
  }
}

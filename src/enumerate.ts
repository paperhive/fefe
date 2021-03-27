import { leafError } from './errors'
import { failure, success } from './result'
import { Validator2 } from './validate'

export function enumerate<T extends (string | number)[]>(
  ...args: T
): Validator2<T[number]> {
  return (value: unknown) => {
    if (args.indexOf(value as T[number]) === -1)
      return failure(leafError(value, `Not one of ${args.join(', ')}.`))
    return success(value as T[number])
  }
}

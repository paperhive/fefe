import { FefeError, leafError, getErrorString } from './errors'
import { failure, isSuccess, success } from './result'
import { Validator, ValidatorReturnType } from './transformer'

export function union<T extends Validator<unknown>[]>(
  ...validators: T
): Validator<ValidatorReturnType<T[number]>> {
  return (value: unknown) => {
    const errors: FefeError[] = []
    for (const validator of validators) {
      const result = validator(value)
      if (isSuccess(result))
        return success(result.right as ValidatorReturnType<T[number]>)
      errors.push(result.left)
    }
    return failure(
      leafError(
        value,
        `Not of any expected type (${errors.map(getErrorString).join(' ')}).`
      )
    )
  }
}

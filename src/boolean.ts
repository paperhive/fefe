import { Either, left, right } from 'fp-ts/lib/Either'
import { leafError, FefeError2 } from './errors'

export function boolean() {
  return (value: unknown): Either<FefeError2, boolean> => {
    // tslint:disable-next-line:strict-type-predicates
    if (typeof value !== 'boolean')
      return left(leafError(value, 'Not a boolean.'))
    return right(value)
  }
}

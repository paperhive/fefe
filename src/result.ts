import { Either, left, right } from 'fp-ts/lib/Either'
import { FefeError2 } from './errors'

export const success = <T>(value: T): Either<never, T> => right(value)
export const failure = (error: FefeError2): Either<FefeError2, never> =>
  left(error)

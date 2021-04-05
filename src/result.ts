import { Either, isLeft, isRight, left, right } from 'fp-ts/lib/Either'

import { FefeError } from './errors'

export type Result<T, E extends FefeError = FefeError> = Either<E, T>

export const success = <T>(value: T): Result<T, never> => right(value)
export const isSuccess = isRight

export const failure = <E extends FefeError>(error: E): Result<never, E> =>
  left(error)
export const isFailure = isLeft

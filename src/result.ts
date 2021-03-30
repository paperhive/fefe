import { Either, isLeft, isRight, left, right } from 'fp-ts/lib/Either'

import { FefeError } from './errors'

export type Result<T> = Either<FefeError, T>

export const success = <T>(value: T): Result<T> => right(value)
export const isSuccess = isRight

export const failure = (error: FefeError): Result<never> => left(error)
export const isFailure = isLeft

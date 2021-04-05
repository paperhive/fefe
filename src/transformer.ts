import { FefeError } from './errors'
import { Result } from './result'

export type Transformer<V, T, E extends FefeError = FefeError> = (
  v: V
) => Result<T, E>

export type Validator<T, E extends FefeError = FefeError> = Transformer<
  unknown,
  T,
  E
>
export type ValidatorReturnType<T> = T extends Validator<infer U> ? U : never

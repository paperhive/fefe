import { Result } from './result'

export type Transformer<V, T> = (v: V) => Result<T>

export type Validator<T> = Transformer<unknown, T>
export type ValidatorReturnType<T> = T extends Validator<infer U> ? U : never

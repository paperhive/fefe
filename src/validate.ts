import { Result } from './result'

export type Validator<R> = (value: unknown) => R
export type Validator2<T> = (v: unknown) => Result<T>
export type Transformer<V, T> = (v: V) => Result<T>

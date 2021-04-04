import { isFailure, Result } from './result'

export type Transformer<V, T> = (v: V) => Result<T>

export type Validator<T> = Transformer<unknown, T>
export type ValidatorReturnType<T> = T extends Validator<infer U> ? U : never

export function toThrow<V, T>(transformer: Transformer<V, T>): (v: V) => T {
  return (v: V) => {
    const result = transformer(v)
    if (isFailure(result)) throw result.left
    return result.right
  }
}

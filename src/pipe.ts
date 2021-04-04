import { isFailure } from './result'
import { Transformer } from './transformer'

export type Pipe<V, T> = Transformer<V, T> & {
  pipe<S>(t: Transformer<T, S>): Pipe<V, S>
}

export function pipe<V, T>(transformer: Transformer<V, T>): Pipe<V, T> {
  const chainedTransformer = ((v: V) => transformer(v)) as Pipe<V, T>
  chainedTransformer.pipe = <S>(nextTransformer: Transformer<T, S>) =>
    pipe((v: V) => {
      const result = transformer(v)
      if (isFailure(result)) return result
      return nextTransformer(result.right)
    })
  return chainedTransformer
}


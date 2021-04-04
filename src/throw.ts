import { FefeError, getErrorString } from './errors'
import { isFailure } from './result'
import { Transformer } from './transformer'

export class ExtendableError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class FefeThrowError extends ExtendableError {
  constructor(public error: FefeError) {
    super(getErrorString(error))
  }
}

export function toThrow<V, T>(transformer: Transformer<V, T>): (v: V) => T {
  return (v: V) => {
    const result = transformer(v)
    if (isFailure(result)) throw new FefeThrowError(result.left)
    return result.right
  }
}

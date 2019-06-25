export class ExtendableError extends Error {
  constructor (message: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export interface FefeChildError {
  key: string | number | symbol
  error: FefeError
}

export class FefeError extends ExtendableError {
  public readonly value: any
  public readonly reason: string
  public readonly child?: FefeChildError

  // derived properties
  public readonly path: (string | number | symbol)[]
  public readonly originalError: FefeError

  constructor (value: any, reason: string, child?: FefeChildError) {
    const path = child ? [child.key, ...child.error.path] : []
    super(child ? `${path.join('.')}: ${reason}` : reason)
    this.value = value
    this.reason = reason
    this.child = child
    this.path = path
    this.originalError = child ? child.error.originalError : this
  }

  createParentError (parentValue: any, key: string | number | symbol) {
    const child: FefeChildError = { key, error: this }
    return new FefeError(parentValue, this.reason, child)
  }
}

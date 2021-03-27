export type Key = string | number | symbol

export interface ChildError2 {
  key: Key
  error: FefeError2
}

export interface LeafError {
  type: 'leaf'
  value: unknown
  reason: string
}

export interface BranchError {
  type: 'branch'
  value: unknown
  childErrors: ChildError2[]
}

export type FefeError2 = LeafError | BranchError

export function leafError(value: unknown, reason: string): LeafError {
  return { type: 'leaf', value, reason }
}

export function branchError(
  value: unknown,
  children: ChildError2[]
): BranchError {
  return { type: 'branch', value, childErrors: children }
}

export type LeafErrorReason = { path: Key[]; reason: string }

export function getLeafErrorReasons(error: FefeError2): LeafErrorReason[] {
  if (error.type === 'leaf') return [{ path: [], reason: error.reason }]

  return error.childErrors.flatMap((child) => {
    return getLeafErrorReasons(child.error).map((leafErrorReason) => ({
      path: [child.key, ...leafErrorReason.path],
      reason: leafErrorReason.reason,
    }))
  })
}

export function getErrorString(error: FefeError2): string {
  return getLeafErrorReasons(error)
    .map(({ path, reason }) => {
      if (path.length === 0) return reason
      return `${path.join('.')}: ${reason}`
    })
    .join(' ')
}

export class ExtendableError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export interface FefeChildError {
  key: string | number | symbol
  error: FefeError
}

export class FefeError extends ExtendableError {
  public readonly value: unknown
  public readonly reason: string
  public readonly child?: FefeChildError

  // derived properties
  public readonly path: (string | number | symbol)[]
  public readonly originalError: FefeError

  constructor(value: unknown, reason: string, child?: FefeChildError) {
    const path = child ? [child.key, ...child.error.path] : []
    super(child ? `${path.join('.')}: ${reason}` : reason)
    this.value = value
    this.reason = reason
    this.child = child
    this.path = path
    this.originalError = child ? child.error.originalError : this
  }

  createParentError(
    parentValue: unknown,
    key: string | number | symbol
  ): FefeError {
    const child: FefeChildError = { key, error: this }
    return new FefeError(parentValue, this.reason, child)
  }
}

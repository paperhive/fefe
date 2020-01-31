import { FefeError } from './errors'

export function enumerate<T extends string[]> (...args: T) {
  return (value: unknown) => {
    if (args.indexOf(value as any) === -1) {
      throw new FefeError(value, `Not one of ${args.join(', ')}.`)
    }
    return value as T[number]
  }
}

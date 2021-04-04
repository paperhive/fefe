import { parseNumber } from './parse-number'
import { string } from './string'

import { Transformer } from './transformer'

// export type First<T extends unknown[]> = T extends [infer U, ...unknown[]]
//   ? U
//   : never

// export type Last<T extends unknown[]> = T extends [...unknown[], infer U]
//   ? U
//   : never

export type FirstInput<T extends Transformer<never, unknown>[]> = T extends [
  Transformer<infer U, unknown>,
  ...Transformer<never, unknown>[]
]
  ? U
  : never

export type LastOutput<T extends Transformer<never, unknown>[]> = T extends [
  ...Transformer<never, unknown>[],
  Transformer<never, infer U>
]
  ? U
  : never

export function compose<T extends Transformer<never, unknown>[]>(
  ...validators: T
): Transformer<FirstInput<T>, LastOutput<T>> {}

const validate = compose(string(), parseNumber())

export { validateArray as array } from './validate-array'
export { validateBoolean as boolean } from './validate-boolean'
export { validateDate as date } from './validate-date'
export { validateNumber as number } from './validate-number'
export { validateObject as object } from './validate-object'
export { validateString as string } from './validate-string'

export type Validate<R> = (value: unknown) => R

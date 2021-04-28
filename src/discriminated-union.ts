import { enumerate } from './enumerate'
import { FefeError } from './errors'
import { object, ObjectDefinition, ObjectOptions, ObjectResult } from './object'
import { isFailure } from './result'
import { Validator } from './transformer'

export type DiscriminatedUnionDefinition = Record<string, ObjectDefinition>

export type DiscriminatedUnionResult<
  K extends string,
  D extends DiscriminatedUnionDefinition
> = {
  [k in keyof D]: ObjectResult<D[k]> & { [l in K]: k }
}[keyof D]

export function discriminatedUnion<
  K extends string,
  D extends DiscriminatedUnionDefinition
>(
  key: K,
  definition: D,
  options: ObjectOptions = {}
): Validator<DiscriminatedUnionResult<K, D>, FefeError> {
  const prevalidate = object(
    {
      [key]: enumerate(...Object.keys(definition)),
    },
    { allowExcessProperties: true }
  ) as Validator<{ [l in K]: keyof D }>

  const validators = Object.fromEntries(
    Object.entries(definition).map(([k, v]) => [
      k,
      object(
        {
          [key]: enumerate(k),
          ...v,
        },
        options
      ),
    ])
  ) as { [k in keyof D]: Validator<ObjectResult<D[k]> & { [l in K]: k }> }

  return (value: unknown) => {
    const prevalidated = prevalidate(value)
    if (isFailure(prevalidated)) return prevalidated
    const v = prevalidated.right[key] as keyof D
    return validators[v](value)
  }
}

import { success } from './result'
import { Transformer } from './transformer'

export type MapObjectKeysMap<V> = {
  [k: string]: keyof V
}

type FilterObject<T, C> = { [k in keyof T]: C extends T[k] ? k : never }
type MatchingKeys<T, C> = FilterObject<T, C>[keyof T]
type OptionalKeys<V, M extends MapObjectKeysMap<V>> = MatchingKeys<
  { [k in keyof M]: V[M[k]] },
  undefined
>

export type MapObjectKeysResult<V, M extends MapObjectKeysMap<V>> = {
  [k in Extract<keyof M, OptionalKeys<V, M>>]?: V[M[k]]
} & {
  [k in Exclude<keyof M, OptionalKeys<V, M>>]: V[M[k]]
}

export function mapObjectKeys<V, M extends MapObjectKeysMap<V>>(
  map: M
): Transformer<V, MapObjectKeysResult<V, M>, never> {
  return (value: V) => {
    const newEntries: [string | symbol | number, unknown][] = []
    ;(Object.entries(map) as [keyof M, keyof V][]).forEach(
      ([resultKey, sourceKey]) => {
        if (!(sourceKey in value)) return
        const val = value[sourceKey]
        newEntries.push([resultKey, val])
      }
    )
    return success(Object.fromEntries(newEntries) as MapObjectKeysResult<V, M>)
  }
}

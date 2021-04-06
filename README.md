# fefe

[![npm version](https://badge.fury.io/js/fefe.svg)](https://badge.fury.io/js/fefe)
[![Test status](https://github.com/paperhive/fefe/actions/workflows/test.yaml/badge.svg)](https://github.com/paperhive/fefe/actions/workflows/test.yaml)
[![codecov](https://codecov.io/gh/paperhive/fefe/branch/main/graph/badge.svg?token=OZcHEYFYrQ)](https://codecov.io/gh/paperhive/fefe)

Validate, sanitize and transform values with proper TypeScript types and with a single dependency ([fp-ts](https://www.npmjs.com/package/fp-ts)).

**🔎&nbsp;&nbsp;Validation:** checks a value (example: check if value is string)<br/>
**:nut_and_bolt:&nbsp;&nbsp;Sanitization:** if a value is not valid, try to transform it (example: transform value to `Date`)<br/>
**🛠️&nbsp;&nbsp;Transformation:** transforms a value (example: parse JSON)<br/>
**🔌&nbsp;&nbsp;Everything is a function**: functional approach makes it easy to extend – just plug in your own function anywhere!<br/>
**↔️&nbsp;&nbsp;Based on `Either`:** explicit and type-safe error handling – `left` path is a (typed!) error, `right` path is a valid value (see below).

## Installation

```bash
npm install fefe
```

## Usage

The

### 🔎 Validation example

Validation checks the provided value and returns it with proper types.

```typescript
import { object, string } from 'fefe'

const validatePerson = object({ name: string() })

const result = validatePerson({ name: 'Leia' })
if (isFailure(result)) {
  return console.error(result.left)

// result is of type { name: string }
const person = result.right
```

☝️ You can also use `fefe` to define your types easily:

```typescript
import { ValidatorReturnType } from 'fefe'
type Person = ValidatorReturnType<typeof validatePerson> // { name: string }
```

### ⚙️ Basic transformation example

#### Parse a value

In this example a `string` needs to be parsed as a `Date`. You can use `pipe()` to pass a value through multiple functions:

```typescript
import { object, parseDate, pipe, string, ValidatorReturnType } from 'fefe'

const sanitizeMovie = object({
  title: string(),
  releasedAt: pipe(string()).pipe(parseDate())
})

// { title: string, releasedAt: Date }
type Movie = ValidatorReturnType<typeof sanitizeMovie>

const movie: Movie = sanitizeMovie({
  title: 'Star Wars',
  releasedAt: '1977-05-25T12:00:00.000Z'
})
```

Then `movie.right` equals `{ title: 'Star Wars', releasedAt: Date(1977-05-25T12:00:00.000Z) }` (`releasedAt` now is a date).

**Note:** Chaining functions can also be achieved by the standard functional tools like `flow` and `chain` in [fp-ts](https://www.npmjs.com/package/fp-ts).

#### Parse a value on demand (sanitize)

Sometimes a value might already be of the right type. In the following example we use `union()` to create a sanitizer that returns a provided value if it is a `Date` already and parse it otherwise. If it can't be parsed either the function will throw:

```typescript
import { date, parseDate, pipe, union } from 'fefe'

const sanitizeDate = union(
  date(),
  pipe(string()).pipe(parseDate())
)
```

### 🛠️ Complex transformation example

This is a more complex example that can be applied to parsing environment variables or query string parameters. Again, we use `pipe` to compose functions. Here, we also add a custom function that splits a string into an array.

```typescript
import { object, parseJson, pipe, string, success } from 'fefe'

const parseConfig = object({
  gcloudCredentials: pipe(string())
    .pipe(parseJson())
    .pipe(object({ secret: string() })),
  whitelist: pipe(string()
    .pipe(secret => success(str.split(',')))
})

// { gcloudCredentials: { secret: string }, whitelist: string[] }
type Config = ValidatorReturnType<typeof parseConfig>

const config: Config = parseConfig({
  gcloudCredentials: '{"secret":"foobar"}',
  whitelist: 'alice,bob'
})
```

Then `config.right` will equal `{ gcloudCredentials: { secret: 'foobar'}, whitelist: ['alice', 'bob'] }`.

## Documentation

### Transformer<T>

A transformer is a function that accepts some value of type `V` (it could be `unknown`) and returns a type `T`:
```typescript
type Transform<T> = (v: V) => Result<T>
```
The result can either be a `FefeError` (see below) or the validated value as type `T`:
```typescript
type Result<T> = Either<FefeError, T>
```

`fefe` uses the `Either` pattern with types and functions from [fp-ts](https://www.npmjs.com/package/fp-ts). `Either` can either represent an error (the "left" path) or the successfully validated value (the "right" path). This results in type-safe errors and explicit error-handling. Example:

```typescript
import { isFailure } from 'fefe'

const result: Result<string> = ...
if (isFailure(result)) {
  console.error(result.left)
  process.exit(1)
}
const name = result.right
```

You may wonder why `fefe` does not just throw an error and the answer is:
1. Throwing an error is a side-effect which goes against pure functional programming.
2. Lack of type-safety: A thrown error can be anything and needs run-time checking before it can be used in a meaningful way.

You can read more about it [here](https://medium.com/nmc-techblog/functional-error-handling-in-js-8b7f7e4fa092).



### Validator<T>

A validator is just a special (but common) case of a transformer where the input is `unknown`:

```typescript
type Validator<T> = Transformer<unknown, T>
```

### `FefeError`

`fefe` validators return a `FefeError` if a value can't be validated/transformed. Note that `FefeError` is *not* derived from the JavaScript `Error` object but is a simple object.

If an error occurs it will allow you to pinpoint where exactly the error(s) occured and why. The structure is the following:

```typescript
type FefeError = LeafError | BranchError
```

#### `LeafError`

A `LeafError` can be seen as the source of an error which can happen deep in a nested object and it carries both the value that failed and a human-readable reason describing why it failed.

```typescript
interface LeafError {
  type: 'leaf'
  value: unknown
  reason: string
}
```

#### `BranchError`

A `BranchError` is the encapsulation of one or more errors on a higher level.

```typescript
interface BranchError {
  type: 'branch'
  value: unknown
  childErrors: ChildError[]
}

interface ChildError {
  key: Key
  error: FefeError
}
```

Imagine an array of values where the values at position 2 and 5 fail. This would result in two `childErrors`: one with `key` equal to 2 and `key` equal to 5. The `error` property is again a `FefeError` so this is a full error tree.

#### `getErrorString(error: FefeError): string`

To simplify handling of errors, you can use `getErrorString()` which traverses the tree and returns a human-readable error message for each `LeafError` – along with the paths and reasons.

Example error message: `user.id: Not a string.`

### `array(elementValidator, options?): Validator<T[]>`

Returns a validator that checks that the given value is an array and that runs `elementValidator` on all elements. A new array with the results is returned as `Result<T[]>`.

Options:
* `elementValidator: Validator<T>`: validator that is applied to each element. The return values are returned as a new array.
* `options.minLength?: number`, `options.maxLength?: number`: restrict length of array
* `options.allErrors?: boolean`: set to `true` to return all errors instead of only the first.

### `boolean(): Validator<boolean>`

Returns a validator that returns `value` if it is a boolean and returns an error otherwise.

### `date(options?): Validator<Date>`

Returns a validator that returns `value` if it is a Date and returns an error otherwise.

Options:
* `options.min?: Date`, `options.max?: Date`: restrict date

### `enumerate(value1, value2, ...): Validator<value1 | value2 | ...>`

Returns a validator that returns `value` if if equals one of the strings `value1`, `value2`, .... and returns an error otherwise.

### `mapObjectKeys(map): Transformer<S, T>`

Returns a transformer that takes the input object and returns a new object with the keys of `map`. For each key `k` the resulting object's value is the value for the key `map[k]` of the input object.

Options:
* `map: Record<string, keyof S>`: maps output object keys to input object keys.

This function is very useful in combination with `object()`:

```typescript
const validateEnv = pipe(
    object({
      FOO: string(),
      BAR: optional(pipe(string()).pipe(parseNumber())),
    })
  )
  .pipe(mapObjectKeys({ foo: 'FOO', bar: 'BAR' }))

const result = validatEnv({ FOO: 'str', BAR: '1337' })
```
Then `isSuccess(result)` will be `true` and `result.right` equals to `{ foo: 'str', bar: 1337 }`.


### `number(options?): Validator<number>`

Returns a validator that returns `value` if it is a number and returns an error otherwise.

Options:
* `options.min?: number`, `options.max?: number`: restrict number
* `options.integer?: boolean`: require number to be an integer (default: `false`)
* `options.allowNaN?: boolean`, `options.allowInfinity?: boolean`: allow `NaN` or `infinity` (default: `false`)

### `object(definition, options?): Validator<ObjectResult<D>>`

Returns a validator that returns `value` if it is an object and all values pass the validation as specified in `definition`, otherwise it returns an error. A new object is returned that has the results of the validator functions as values.

Options:
* `definition: ObjectDefinition`: an object where each value is a `Validator<T>`.
* `allowExcessProperties?: boolean`: allow excess properties in `value` (default: `false`). Excess properties are not copied to the returned object.
* `allErrors?: boolean`: set to `true` to return all errors instead of only the first (default: `false`).

You can use the following helpers:
* `optional(validator: Validator<T>)`: generates an optional key validator with the given `validator`.
* `defaultTo(validator: Validator<T>, default: D | () => D`: generates a validator that defaults to `default()` if it is a function and `default` otherwise.

### `pipe(validator1: Transformer<A, B>): Pipe<A, B>`

Returns a transformer that offers a `.pipe(validator2: Transformer<B, C>): Pipe<A, C>` method.

### `string(options?): Validator<string>`

Returns a validator that returns `value` if it is a string and returns an error otherwise.

Options:
* `options.minLength?: number`, `options.maxLength?: number`: restrict length of string
* `options.regex?: RegExp`: require string to match regex

### `union(validator1, validator2, ...): Validator<A | B | ...>`

Returns a validator that returns the return value of the first validator called with `value` that does not return an error. The function returns an error if all validators return an error. All arguments are validators (e.g., `validator1: Validator<A>, validator2: Validator<B>, ...`)

### `parseBoolean(): Transformer<string, boolean>`

Returns a transformer that parses a string as a boolean.

### `parseDate(options?): Transformer<string, Date>`

Returns a transformer that parses a string as a date.

Options:
* `options.iso?: boolean`: require value to be an ISO 8601 string.

### `parseJson(): Transformer<string, unknown>`

Returns a transformer that parses a JSON string. Since parsed JSON can in turn be almost anything, it is usually combined with another validator like `object({ ... })`.

### `parseNumber(): Transformer<string, number>`

Returns a transformer that parses a number string.

# fefe

[![npm version](https://badge.fury.io/js/fefe.svg)](https://badge.fury.io/js/fefe)
[![Test status](https://github.com/paperhive/fefe/actions/workflows/test.yaml/badge.svg)](https://github.com/paperhive/fefe/actions/workflows/test.yaml)
[![codecov](https://codecov.io/gh/paperhive/fefe/branch/master/graph/badge.svg)](https://codecov.io/gh/paperhive/fefe)

Validate, sanitize and transform values with proper TypeScript types and with zero dependencies.

**🔎&nbsp;&nbsp;Validation:** checks a value (example: check if value is string)<br/>
**:nut_and_bolt:&nbsp;&nbsp;Sanitization:** if a value is not valid, try to transform it (example: transform value to `Date`)<br/>
**🛠️&nbsp;&nbsp;Transformation:** transforms a value (example: parse JSON)<br/>
**🔌&nbsp;&nbsp;Everything is a function**: functional approach makes it easy to extend – just plug in your own function anywhere!

## Installation

```bash
npm install fefe
```

## Usage

### 🔎 Validation example

Validation only checks the provided value and returns it with proper types.

```typescript
import { object, string } from 'fefe'

const validatePerson = object({ name: string() })

// result is of type { name: string }
const person = validatePerson({ name: 'Leia' })

// throws FefeError because 'foo' is not a valid property
validatePerson({ foo: 'bar' })
```

☝️ You can also use `fefe` to define your types easily:

```typescript
type Person = ReturnType<typeof validatePerson> // { name: string }
```

### ⚙️ Basic transformation example

#### Parse a value

In this example a `string` needs to be parsed as a `Date`.

```typescript
import { object, parseDate, string } from 'fefe'

const sanitizeMovie = object({
  title: string(),
  releasedAt: parseDate()
})

// { title: string, releasedAt: Date }
type Movie = ReturnType<typeof sanitizeMovie>

const movie: Movie = sanitizeMovie({
  title: 'Star Wars',
  releasedAt: '1977-05-25T12:00:00.000Z'
})
```

Then `movie` equals `{ title: 'Star Wars', releasedAt: Date(1977-05-25T12:00:00.000Z) }` (`releasedAt` now is a date).

#### Parse a value on demand (sanitize)

Sometimes a value might already be of the right type. In the following example we use `union()` to create a sanitizer that returns a provided value if it is a Date already and parse it otherwise. If it can't be parsed either the function will throw:

```typescript
import { date, parseDate, union } from 'fefe'

const sanitizeDate = union(date(), parseDate())
```

### 🛠️ Complex transformation example

This is a more complex example that can be applied to parsing environment variables or query string parameters. Note how easy it is to apply a chain of functions to validate and transform a value (here we use `ramda`).

```typescript
import { object, parseJson, string } from 'fefe'
import { pipe } from 'ramda'

const parseConfig = object({
  gcloudCredentials: pipe(
    parseJson(),
    object({ secret: string() })
  ),
  whitelist: pipe(string(), secret => str.split(','))
})

// { gcloudCredentials: { secret: string }, whitelist: string[] }
type Config = ReturnType<typeof parseConfig>

const config: Config = parseConfig({
  gcloudCredentials: '{"secret":"foobar"}',
  whitelist: 'alice,bob'
})
```

Then `config` will equal `{ gcloudCredentials: { secret: 'foobar'}, whitelist: ['alice', 'bob'] }`.

## Documentation

### `FefeError`

`fefe` throws a `FefeError` if a value can't be validated/transformed. A `FefeError` has the following properties:

* `reason`: the reason for the error.
* `value`: the value that was passed.
* `path`: the path in `value` to where the error occured.

### `array(elementValidator, options?)`

Returns a function `(value: unknown) => T[]` that checks that the given value is an array and that runs `elementValidator` on all elements. A new array with the results is returned.

Options:
* `elementValidator`: validator function `(value: unknown) => T` that is applied to each element. The return values are returned as a new array.
* `options.minLength?`, `options.maxLength?`: restrict length of array

### `boolean()`

Returns a function `(value: unknown) => boolean` that returns `value` if it is a boolean and throws otherwise.

### `date(options?)`

Returns a function `(value: unknown) => Date` that returns `value` if it is a Date and throws otherwise.

Options:
* `options.min?`, `options.max?`: restrict date

### `enumerate(value1, value2, ...)`

Returns a function `(value: unknown) => value1 | value2 | ...` that returns `value` if if equals one of the strings `value1`, `value2`, .... and throws otherwise.

### `number(options?)`

Returns a function `(value: unknown) => number` that returns `value` if it is a number and throws otherwise.

Options:
* `options.min?`, `options.max?`: restrict number
* `options.integer?`: require number to be an integer (default: `false`)
* `options.allowNaN?`, `options.allowInfinity?`: allow `NaN` or `infinity` (default: `false`)

### `object(definition, options?)`

Returns a function `(value: unknown) => {...}` that returns `value` if it is an object and all values pass the validation as specified in `definition`, otherwise it throws. A new object is returned that has the results of the validator functions as values.

Options:
* `definition`: an object where each value is either:
   * a validator functions `(value: unknown) => T` or
   * an object with the following properties:
      * `validator`: validator function `(value: unknown) => T`
      * `optional?`: allow undefined values (default: `false`)
      * `default?`: default value of type `T` or function `() => T` that returns a default value
* `allowExcessProperties?`: allow excess properties in `value` (default: `false`). Excess properties are not copied to the returned object.

You can use the following helpers:
* `optional(validator)`: generates an optional key validator with the given `validator`.
* `defaultTo(validator, default)`: generates a key validator that defaults to `default` (also see `default` option above).

### `string(options?)`

Returns a function `(value: unknown) => string` that returns `value` if it is a string and throws otherwise.

Options:
* `options.minLength?`, `options.maxLength?`: restrict length of string
* `options.regex?`: require string to match regex

### `union(validator1, validator2, ...)`

Returns a function `(value: unknown) => return1 | return2 | ...` that returns the return value of the first validator called with `value` that does not throw. The function throws if all validators throw.

### `parseBoolean()`

Returns a function `(value: string) => boolean` that parses a string as a boolean.

### `parseDate(options?)`

Returns a function `(value: string) => Date` that parses a string as a date.

Options:
* `options.iso?`: require value to be an ISO 8601 string.

### `parseJson()`

Returns a function `(value: string) => any` that parses a JSON string.

### `parseNumber()`

Returns a function `(value: string) => number` that parses a number string.

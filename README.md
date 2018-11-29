# fefe

[![npm version](https://badge.fury.io/js/fefe.svg)](https://badge.fury.io/js/fefe)
[![Build Status](https://travis-ci.org/paperhive/fefe.svg?branch=master)](https://travis-ci.org/paperhive/fefe)
[![codecov](https://codecov.io/gh/paperhive/fefe/branch/master/graph/badge.svg)](https://codecov.io/gh/paperhive/fefe)

Validate, sanitize and transform values with proper types and with zero dependencies.

**🔎 Validation:** checks a value (example: check if value is string)<br/>
**⚙ Sanitization:** if a value is not valid, try to transform it (example: transform value to `Date`)<br/>
**🛠️ Transformation:** transforms a value (example: parse JSON)<br/>
**🔌 Schemas are functions**: easily extendable

## Installation

```bash
npm install fefe
```

## Usage

### 🔎 Validation example

Validation only checks the provided value and returns it with proper types.

```typescript
import { validate } from 'fefe'

const validatePerson = validate.object({ name: validate.string() })

// result is of type { name: string }
const person = validatePerson({ name: 'Leia' })

// throws FefeError because 'foo' is not a valid property
validatePerson({ foo: 'bar' })
```

☝️ You can also use `fefe` to define your types easily:

```typescript
type Person = ReturnType<typeof validatePerson> // { name: string }
```

### ⚙️ Basic transformation example (sanitization/parsing)

In this example a `string` needs to be parsed as a `Date`. Note how easy it is to apply a chain of functions to validate and transform a value (here we use `ramda`).

```typescript
import { transform, validate } from 'fefe'
import { pipe } from 'ramda'

const sanitizeMovie = validate.object({
  title: validate.string(),
  releasedAt: pipe(validate.string(), transform.parseDate())
})

// { title: string, releasedAt: Date }
type Movie = ReturnType<typeof sanitizeMovie>

const movie: Movie = sanitizeMovie({
  title: 'Star Wars',
  releasedAt: '1977-05-25T12:00:00.000Z'
})
```

Then `movie` equals `{ title: 'Star Wars', releasedAt: Date(1977-05-25T12:00:00.000Z) }` (`releasedAt` now is a date).

### 🛠️ Complex transformation example

This is a more complex example that can be applied to parsing environment variables or query string parameters.

```typescript
import { transform, validate } from 'fefe'
import { pipe } from 'ramda'

const parseConfig = validate.object({
  gcloudCredentials: pipe(
    validate.string(),
    transform.parseJson(),
    validate.object({ key: validate.string() })
  ),
  whitelist: pipe(validate.string(), str => str.split(','))
})

// { gcloudCredentials: { key: string }, whitelist: string[] }
type Config = ReturnType<typeof parseConfig>

const config: Config = parseConfig({
  gcloudCredentials: '{"key":"secret"}',
  whitelist: 'alice,bob'
})
```

Then `config` will equal `{ gcloudCredentials: { key: 'secret'}, whitelist: ['alice', 'bob'] }`.

**Note:** you can use validations in transformations.

## Documentation

### `FefeError`

`fefe` throws a `FefeError` if a value can't be validated/transformed. A `FefeError` has the following properties:

* `reason`: the reason for the error.
* `value`: the value that was passed.
* `path`: the path in `value` to where the error occured.

### `validate.array(elementValidate, options?)`

Returns a function `(value: unknown) => T[]` that checks that the given value is an array and that runs `elementValidate` on all elements. A new array with the results is returned.

Options:
* `elementValidate`: validator function `(value: unknown) => T` that is applied to each element. The return values are returned as a new array.
* `options.minLength?`, `options.maxLength?`: restrict length of array

### `validate.boolean()`

Returns a function `(value: unknown) => boolean` that checks that whether `value` is a boolean.

### `validate.date(options?)`

Returns a function `(value: unknown) => Date` that checks that whether `value` is a Date.

Options:
* `options.min?`, `options.max?`: restrict date

### `validate.enum(value1, value2, ...)`

Returns a function `(value: unknown) => value1 | value2 | ...` that checks whether value equals one of the strings `value1`, `value2`, ....

### `validate.number(options?)`

Returns a function `(value: unknown) => number` that checks that whether `value` is a number.

Options:
* `options.min?`, `options.max?`: restrict number
* `options.integer?`: require number to be an integer (default: `false`)
* `options.allowNaN?`, `options.allowInfinity?`: allow `NaN` or `infinity` (default: `false`)

### `validate.object(definition, options?)`

Returns a function `(value: unknown) => {...}` that checks that whether `value` is an object and all values pass the validation as specified in `definition`. A new object is returned that has the results of the validator functions as values.

Options:
* `definition`: an object where each value is either:
   * a validator functions `(value: unknown) => T` or
   * an object with the following properties:
      * `validate`: validator function `(value: unknown) => T`
      * `optional?`: allow undefined values (default: `false`)
      * `default?`: default value of type `T` or function `() => T` that returns a default value
* `allowExcessProperties?`: allow excess properties (default: `false`)

### `validate.string(options?)`

Returns a function `(value: unknown) => string` that checks that whether `value` is a string.

Options:
* `options.minLength?`, `options.maxLength?`: restrict length of string
* `options.regex?`: require string to match regex

### `transform.parseBoolean()`

Returns a function `(value: string) => boolean` that parses a string as a boolean.

### `transform.parseDate(options?)`

Returns a function `(value: string) => Date` that parses a string as a date.

Options:
* `options.iso?`: require value to be an ISO 8601 string.

### `transform.parseJson()`

Returns a function `(value: string) => any` that parses JSON.

### `transform.parseNumber()`

Returns a function `(value: string) => number` that parses a number.

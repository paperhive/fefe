# fefe

[![npm version](https://badge.fury.io/js/fefe.svg)](https://badge.fury.io/js/fefe)
[![Build Status](https://travis-ci.org/paperhive/fefe.svg?branch=master)](https://travis-ci.org/paperhive/fefe)
[![codecov](https://codecov.io/gh/paperhive/fefe/branch/master/graph/badge.svg)](https://codecov.io/gh/paperhive/fefe)

`fefe` validates, sanitizes and transforms values with proper types.

**🔎 Validation:** checks a value (example: check if value is string)<br/>
**⚙️ Sanitization:** if a value is not valid, try to transform it (example: transform value to `Date`)<br/>
**🚀 Transformation:** transforms a value (example: parse JSON)<br/>
**🔌 Schemas are functions**: easily extendable

## 🔎 Validation example

Validation only checks the provided value and returns it with proper types.

```typescript
import { validate } from 'fefe'

const validatePerson = validate.object({ name: validate.string() })

// result is of type { name: string }
const person = validatePerson({ name: 'Leia' })

// throws FefeError because 'foo' is not a valid property
validatePerson({ foo: 'bar' })
```

You can also use `fefe` to define your types easily:

```typescript
type Person = ReturnType<typeof validatePerson> // { name: string }
```

## ⚙️ Sanitization example

```typescript
import { sanitize, validate } from 'fefe'

const sanitizeMovie = validate.object({
  title: validate.string(),
  releasedAt: sanitize.date()
})

// { title: string, releasedAt: Date }
type Movie = ReturnType<typeof sanitizeMovie>

const book: Book = sanitizeMovie({
  title: 'Star Wars',
  releasedAt: '1977-05-25T12:00:00.000Z'
})
```

Then `book` equals `{ title: 'Star Wars', releasedAt: Date(1977-05-25T12:00:00.000Z) }` (`releasedAt` now is a date).

## 🚀 Transformation example

This is an example that can be applied to parsing environment variables or query string parameters.

```typescript
import { sanitize, transform, validate } from 'fefe'

const parseConfig = validate.object({
  gcloudCredentials: pipe(
    transform.fromJson(),
    validate.object({ key: validate.string() })
  ),
  whitelist: pipe(
    validate.string(),
    str => str.split(',').map(sanitize.number())
  )
})

// { gcloudCredentials: { key: string }, whitelist: number[] }
type Config = ReturnType<typeof parseConfig>

const config: Config = parseConfig({
  gcloudCredentials: '{"key":"secret"}',
  whitelist: '42,1337'
})
```

Then `config` will equal `{ gcloudCredentials: { key: 'secret'}, whitelist: [42, 1337] }`.

**Note:** you can use validations in transformations.


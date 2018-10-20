import { expect } from 'chai'
import { pipe } from 'ramda'

import { FefeError, validate } from '.'

describe('validate integration tests', () => {
  describe('Person', () => {
    const validatePerson = validate.object({
      name: validate.string(),
      age: validate.number({ min: 0 }),
      address: validate.object({
        street: validate.string(),
        zip: validate.number()
      }),
      isVerified: validate.boolean(),
      joinedAt: validate.date(),
      favoriteDishes: validate.array(validate.string())
    })

    type Person = ReturnType<typeof validatePerson>

    const validPerson: Person = {
      name: 'André',
      age: 35,
      address: { street: 'Kreuzbergstr', zip: 10965 },
      isVerified: true,
      joinedAt: new Date(),
      favoriteDishes: ['Pho Bo', 'Sushi']
    }

    it('should validate a person', () => {
      const person = validatePerson(validPerson)
      expect(person).to.eql(validPerson)
    })

    it('should throw with an invalid person', () => {
      const invalidPerson = { ...validPerson, address: { street: 'Ackerstr', zip: 'foo' } }
      expect(() => validatePerson(invalidPerson)).to.throw(FefeError, 'address.zip: Not a number.')
        .that.deep.include({ value: invalidPerson, path: ['address', 'zip'] })
        .and.has.property('originalError').that.include({ value: 'foo' })
    })
  })
})

describe('Complex example', () => {
  describe('Config', () => {
    const parseConfig = validate.object({
      gcloudCredentials: pipe(validate.string(), JSON.parse, validate.object({ key: validate.string() })),
      whitelist: pipe(validate.string(), value => value.split(','))
    })

    type Config = ReturnType<typeof parseConfig>

    const validConfig: Config = {
      gcloudCredentials: { key: 'secret' },
      whitelist: ['alice', 'bob']
    }

    const validConfigInput = {
      gcloudCredentials: '{ "key": "secret" }',
      whitelist: 'alice,bob'
    }

    it('should parse a config', () => {
      const config = parseConfig(validConfigInput)
      expect(config).to.eql(validConfig)
    })

    it('should throw with an invalid config', () => {
      const invalidConfigInput = { ...validConfigInput, gcloudCredentials: '{ "key": "secret", "foo": "bar" }' }
      expect(() => parseConfig(invalidConfigInput)).to.throw(FefeError, 'gcloudCredentials: Key(s) not allowed: foo')
        .that.deep.include({ value: invalidConfigInput, path: ['gcloudCredentials'] })
        .and.has.property('originalError').that.include({ value: { key: 'secret', foo: 'bar' } })
    })
  })
})

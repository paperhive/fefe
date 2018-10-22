import { expect } from 'chai'
import { pipe } from 'ramda'

import { FefeError, transform, validate } from '.'

describe('Integration tests', () => {
  describe('Basic validation', () => {
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

    it('validates a person', () => {
      const person = validatePerson(validPerson)
      expect(person).to.eql(validPerson)
    })

    it('throws with an invalid person', () => {
      const invalidPerson = { ...validPerson, address: { street: 'Ackerstr', zip: 'foo' } }
      expect(() => validatePerson(invalidPerson))
        .to.throw(FefeError, 'address.zip: Not a number.')
        .that.deep.include({ value: invalidPerson, path: ['address', 'zip'] })
        .and.has.property('originalError').that.include({ value: 'foo' })
    })
  })

  describe('Basic transformation (sanitization)', () => {
    const sanitizeMovie = validate.object({
      title: validate.string(),
      releasedAt: pipe(validate.string(), transform.parseDate())
    })

    // { title: string, releasedAt: Date }
    type Movie = ReturnType<typeof sanitizeMovie>

    it('validates a movie and parses the date string', () => {
      const movie = sanitizeMovie({
        title: 'Star Wars',
        releasedAt: '1977-05-25T12:00:00.000Z'
      })
      expect(movie).to.eql({
        title: 'Star Wars',
        releasedAt: new Date('1977-05-25T12:00:00.000Z')
      })
    })

    it('throws with an invalid date', () => {
      const invalidMovie = { title: 'Star Wars', releasedAt: 'foo' }
      expect(() => sanitizeMovie(invalidMovie))
      .to.throw(FefeError, 'releasedAt: Not a date.')
      .that.deep.include({ value: invalidMovie, path: ['releasedAt'] })
      .and.has.property('originalError').that.include({ value: 'foo' })
    })
  })

  describe('Complex transformation and validation', () => {
    const parseConfig = validate.object({
      gcloudCredentials: pipe(validate.string(), transform.parseJson(), validate.object({ key: validate.string() })),
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

    it('parses a config', () => {
      const config = parseConfig(validConfigInput)
      expect(config).to.eql(validConfig)
    })

    it('throws with an invalid config', () => {
      const invalidConfigInput = { ...validConfigInput, gcloudCredentials: '{ "key": "secret", "foo": "bar" }' }
      expect(() => parseConfig(invalidConfigInput)).to.throw(FefeError, 'gcloudCredentials: Properties not allowed: foo')
        .that.deep.include({ value: invalidConfigInput, path: ['gcloudCredentials'] })
        .and.has.property('originalError').that.include({ value: { key: 'secret', foo: 'bar' } })
    })
  })
})

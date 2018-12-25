import { expect } from 'chai'
import { pipe } from 'ramda'

import * as fefe from '.'

describe('Integration tests', () => {
  describe('Basic validation', () => {
    const validatePerson = fefe.object({
      name: fefe.string(),
      age: fefe.number({ min: 0 }),
      address: fefe.object({
        street: fefe.string(),
        zip: fefe.number()
      }),
      isVerified: fefe.boolean(),
      verifiedAt: fefe.union(fefe.date(), fefe.enum('never')),
      joinedAt: fefe.date(),
      favoriteDishes: fefe.array(fefe.string()),
      notifications: fefe.enum('immediately', 'daily', 'never')
    })

    type Person = ReturnType<typeof validatePerson>

    const validPerson: Person = {
      name: 'André',
      age: 35,
      address: { street: 'Kreuzbergstr', zip: 10965 },
      isVerified: true,
      verifiedAt: 'never',
      joinedAt: new Date(),
      favoriteDishes: ['Pho Bo', 'Sushi'],
      notifications: 'daily'
    }

    it('validates a person', () => {
      const person = validatePerson(validPerson)
      expect(person).to.eql(validPerson)
    })

    it('throws with an invalid person', () => {
      const invalidPerson = { ...validPerson, address: { street: 'Ackerstr', zip: 'foo' } }
      expect(() => validatePerson(invalidPerson))
        .to.throw(fefe.FefeError, 'address.zip: Not a number.')
        .that.deep.include({ value: invalidPerson, path: ['address', 'zip'] })
        .and.has.property('originalError').that.include({ value: 'foo' })
    })
  })

  describe('Basic transformation (sanitization)', () => {
    const sanitizeMovie = fefe.object({
      title: fefe.string(),
      releasedAt: pipe(fefe.string(), fefe.parseDate())
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
      .to.throw(fefe.FefeError, 'releasedAt: Not a date.')
      .that.deep.include({ value: invalidMovie, path: ['releasedAt'] })
      .and.has.property('originalError').that.include({ value: 'foo' })
    })
  })

  describe('Complex transformation and validation', () => {
    const parseConfig = fefe.object({
      gcloudCredentials: pipe(fefe.string(), fefe.parseJson(), fefe.object({ key: fefe.string() })),
      whitelist: pipe(fefe.string(), value => value.split(','))
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
      expect(() => parseConfig(invalidConfigInput)).to.throw(fefe.FefeError, 'gcloudCredentials: Properties not allowed: foo')
        .that.deep.include({ value: invalidConfigInput, path: ['gcloudCredentials'] })
        .and.has.property('originalError').that.include({ value: { key: 'secret', foo: 'bar' } })
    })
  })
})

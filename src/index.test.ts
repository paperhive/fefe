import { assert } from 'chai'
import { chain } from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'

import * as fefe from '.'

import { branchError, leafError } from './errors'
import { failure, success } from './result'
import { ValidatorReturnType } from './validate'

describe('Integration tests', () => {
  describe('Basic validation', () => {
    const validatePerson = fefe.object({
      name: fefe.string(),
      age: fefe.number({ min: 0 }),
      address: fefe.object({
        street: fefe.string(),
        zip: fefe.number(),
      }),
      // isVerified: fefe.boolean(),
      verifiedAt: fefe.union(fefe.date(), fefe.enumerate('never')),
      joinedAt: fefe.date(),
      favoriteDishes: fefe.array(fefe.string()),
      notifications: fefe.enumerate('immediately', 'daily', 'never'),
    })

    type Person = ValidatorReturnType<typeof validatePerson>

    const validPerson: Person = {
      name: 'André',
      age: 35,
      address: { street: 'Kreuzbergstr', zip: 10965 },
      // isVerified: true,
      verifiedAt: 'never',
      joinedAt: new Date(),
      favoriteDishes: ['Pho Bo', 'Sushi'],
      notifications: 'daily',
    }

    it('validates a person', () =>
      assert.deepStrictEqual(validatePerson(validPerson), success(validPerson)))

    it('returns an error if person is invalid', () => {
      const invalidPerson = {
        ...validPerson,
        address: { street: 'Ackerstr', zip: 'foo' },
      }
      assert.deepStrictEqual(
        validatePerson(invalidPerson),
        failure(
          branchError(invalidPerson, [
            {
              key: 'address',
              error: branchError(invalidPerson.address, [
                { key: 'zip', error: leafError('foo', 'Not a number.') },
              ]),
            },
          ])
        )
      )
    })
  })

  describe('Basic transformation (sanitization)', () => {
    const sanitizeMovie = fefe.object({
      title: fefe.string(),
      releasedAt: flow(fefe.string(), chain(fefe.parseDate())),
    })

    it('validates a movie and parses the date string', () => {
      const movie = sanitizeMovie({
        title: 'Star Wars',
        releasedAt: '1977-05-25T12:00:00.000Z',
      })
      assert.deepStrictEqual(
        movie,
        success({
          title: 'Star Wars',
          releasedAt: new Date('1977-05-25T12:00:00.000Z'),
        })
      )
    })

    it('returns error if date is invalid', () => {
      const invalidMovie = { title: 'Star Wars', releasedAt: 'foo' }
      assert.deepStrictEqual(
        sanitizeMovie(invalidMovie),
        failure(
          branchError(invalidMovie, [
            {
              key: 'releasedAt',
              error: leafError('foo', 'Not a date.'),
            },
          ])
        )
      )
    })
  })

  describe('Basic transformation (on-demand sanitization)', () => {
    const sanitizeDate = fefe.union(
      fefe.date(),
      flow(fefe.string(), chain(fefe.parseDate()))
    )
    const date = new Date()

    it('returns a date', () =>
      assert.deepStrictEqual(sanitizeDate(date), success(date)))

    it('returns a parsed date', () =>
      assert.deepStrictEqual(sanitizeDate(date.toISOString()), success(date)))

    it('throws with an invalid date', () =>
      assert.deepStrictEqual(
        sanitizeDate('foo'),
        failure(
          leafError(
            'foo',
            'Not of any expected type (Not a date. Not a date.).'
          )
        )
      ))
  })

  describe('Complex transformation and validation', () => {
    const parseConfig = fefe.object({
      gcloudCredentials: flow(
        fefe.string(),
        chain(fefe.parseJson()),
        chain(fefe.object({ key: fefe.string() }))
      ),
      whitelist: flow(
        fefe.string(),
        chain((value) => success(value.split(',')))
      ),
    })

    type Config = ValidatorReturnType<typeof parseConfig>

    const validConfig: Config = {
      gcloudCredentials: { key: 'secret' },
      whitelist: ['alice', 'bob'],
    }

    const validConfigInput = {
      gcloudCredentials: '{ "key": "secret" }',
      whitelist: 'alice,bob',
    }

    it('parses a config', () =>
      assert.deepStrictEqual(
        parseConfig(validConfigInput),
        success(validConfig)
      ))

    it('throws with an invalid config', () => {
      const invalidConfigInput = {
        ...validConfigInput,
        gcloudCredentials: '{ "key": "secret", "foo": "bar" }',
      }
      assert.deepStrictEqual(
        parseConfig(invalidConfigInput),
        failure(
          branchError(invalidConfigInput, [
            {
              key: 'gcloudCredentials',
              error: leafError(
                { key: 'secret', foo: 'bar' },
                'Properties not allowed: foo.'
              ),
            },
          ])
        )
      )
      // expect(() => )
      //   .to.throw(
      //     fefe.FefeError,
      //     'gcloudCredentials: Properties not allowed: foo'
      //   )
      //   .that.deep.include({
      //     value: invalidConfigInput,
      //     path: ['gcloudCredentials'],
      //   })
      //   .and.has.property('originalError')
      //   .that.include({ value: { key: 'secret', foo: 'bar' } })
    })
  })
})

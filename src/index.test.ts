import { expect } from 'chai'

import { FefeError, validate } from '.'

describe('validate integration tests', () => {
  describe('person', () => {
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

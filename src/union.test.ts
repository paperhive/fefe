// import { expect } from 'chai'

// import { FefeError } from './errors'
// import { boolean } from './boolean'
// import { string } from './string'
// import { union } from './union'

// describe('union()', () => {
//   const validate = union(boolean(), string())

//   it('should throw if all validators throw', () => {
//     expect(() => validate(1)).to.throw(FefeError, 'Not of any expected type.')
//   })

//   it('should validate either type', () => {
//     const booleanResult: boolean | string = validate(false)
//     expect(booleanResult).to.equal(false)
//     const stringResult: boolean | string = validate('foo')
//     expect(stringResult).to.equal('foo')
//   })
// })

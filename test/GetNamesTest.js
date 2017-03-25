import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

const expect = chai.expect

chai.use(chaiAsPromised)
const dummyHTTP = (input) => {
  return new Promise((resolve, reject) => {
    console.log('HTTP ', input)
    resolve(input)
  })
}

const getNames = () => {
  return new Promise((resolve, reject) => {
    const unprocessed = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
    dummyHTTP(unprocessed.splice(0, 5))
      .then(response => {
        console.log('unprocessed length: ', unprocessed.length)
        console.log('SET UNPROCESSED ', unprocessed)
        console.log('INSERT_SUGGESTIONS ', response)
        resolve()
      })
  })
}
/*
describe('GetNames action', () => {
  it('Should pass the first 5 elements to HTTP', () => {

    getNames()

    return expect(getNames).to.eventually.be.fulfilled
  })
  // it('Should insert the returned values to suggestions')
  // it('Should remove the first 5 elements from the unprocessed')
})
*/
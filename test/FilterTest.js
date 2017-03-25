import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import Filter from '../client/store/filter'

const expect = chai.expect

chai.use(chaiAsPromised)

const BasicArrayTests = (method) => {
  it('Should return an array', () => {
    return expect(method(['hello world'])).to.eventually.be.a('array')
  })
  it('Should be rejected if empty', () => {
    return expect(method([])).to.be.rejected
  })
}

describe('ReplaceNordics()', () => {
  BasicArrayTests(Filter.ReplaceNordics)

  it('ÅÄÖåäö should return aaoaao', () => {
    var result = Filter.ReplaceNordics(['ÅÄÖåäö'])

    return expect(result).to.eventually.eql(['aaoaao'])
  })
  
})

describe('LimitLength()', () => {
  BasicArrayTests(Filter.LimitLength)

  it('Should return strings less than max allowed chars', () => {
    let input = ['thisisaverylongstring', 'thisoneis']
    let result = Filter.LimitLength(input)

    return expect(result).to.eventually.eql(['thisoneis'])
  })
  it('Should be rejected if empty after filter', () => {
    let input = ['thisisaverylongstring', 'thisisaverylongstring']
    let result = Filter.LimitLength(input)

    return expect(result).to.be.rejected
  })
})

describe('RemoveSpecialChars()', () => {
  BasicArrayTests(Filter.RemoveSpecialChars)

  it('Should remove all non-letter chars except *', () => {
    const input = ['abc!"#€%&/()=?`^*;:_-<></>≤|§ÅÄÖ']
    return expect(Filter.RemoveSpecialChars(input)).to.eventually.eql(['abc*'])
  })
})

describe('RemoveDuplicates()', () => {
  BasicArrayTests(Filter.RemoveDuplicates)

  it('Should return unique strings', () => {
    const input = ['hello', 'hello', 'ello']
    return expect(Filter.RemoveDuplicates(input)).to.eventually.eql(['hello', 'ello'])
  })
})

describe('SortPrefixAndSuffix()', () => {
  it('Should only return properties with values', () => {
    const input = ['*hello', 'hello*']
    return expect(Filter.SortSuffixAndPrefix(input)).to.eventually.have.all.keys('prefix', 'suffix')
      .and.to.eventually.not.have.property('normal')
  })
  it('Should reject if empty', () => {
    const input = []
    return expect(Filter.SortSuffixAndPrefix(input)).to.eventually.be.rejected
  })
})

describe('CombineArrayWords()', () => {
  it('Should return twice as big array as input', () => {
    const first = ['a', 'b', 'c']
    const second = ['d', 'e', 'f', 'g']

    expect(Filter.CombineArrayWords(first, second)).to.have.lengthOf(12)
    expect(Filter.CombineArrayWords(second, second)).to.have.lengthOf(16)
    .and.not.contain(null)
    .and.not.contain(undefined)
  })
})

describe('CombineWords()', () => {
  it('Should be rejected if empty', () => {
    return expect(Filter.CombineWords([])).to.be.rejected
  })

  it('Should return an array', () => {
    const input = { prefix: ['prefix'], normal: ['normal'], suffix: ['suffix'], synonym: ['SYNONYM', 'SYNONYM2'] }

    expect(Filter.CombineWords(input)).to.eventually.be.an('array')
    .and.not.contain(null)
    .and.not.contain(undefined)
  })
  it('Should accept any property', () => {
    const input = { prefix: ['hello'], normal: ['world'], random: ['random'] }

    expect(Filter.CombineWords(input)).to.eventually.eql([ 'hello','helloworld','hellorandom','world','worldworld','worldrandom','random','randomworld','randomrandom' ])
  })
})

const actionSequence = (input) => {
  return new Promise((resolve, reject) => {
    Filter.ReplaceNordics(input)
      .then(Filter.LimitLength)
      .then(Filter.RemoveSpecialChars)
      .then(Filter.RemoveDuplicates)
      .then(Filter.SortSuffixAndPrefix)
      .then((result) => { resolve(result) },
        (error) => { reject(error) })
  }
  )}
const synonymSequence = (input) => {
  return new Promise((resolve, reject) => {
    SynonymAPI(input)
      .then(Filter.FlattenObject)
      .then(Filter.RemoveMultiWords)
      .then(Filter.LimitLength)
      .then(Filter.RemoveSpecialChars)
      .then(Filter.RemoveDuplicates)
      .then((result) => { resolve(result) },
        (error) => { resolve([]) })
  })
}

const CompleteAction = (syn, inp) => {
  const synonym = synonymSequence(syn)
  const input = actionSequence(inp)

  return Promise.all([synonym,input])
  .then(Filter.MergeSynonyms)
  .then(Filter.CombineWords)
  .then(Filter.LimitLength)
  .then(Filter.RemoveDuplicates)
  .then(Filter.AddDomainSuffix.bind(null, ['.com']))
  .then(Filter.RemoveSaved.bind(null, [ ['hello.com'], ['love.com'] ]))
  .catch(err => { })
}

const SynonymAPI = (input) => {
  return new Promise((resolve, reject) => {
    if(input.length !== 0) {
      resolve({data:{"noun":{"syn":["passion","sexual love"],"ant":["hate"],"usr":["amour"]},"verb":{"syn":["love","roll in the hay"],"ant":["hate"]}}})
    } else {
      reject()
    }
  })
}

describe('GenerateNames Input', () => {
  it('Should return an object', () => {
    const input = ['*mommo']

    actionSequence(input).then((result) => { console.log('result') })

    var result = actionSequence(input)
    return expect(result).to.eventually.be.an('object')
  })
  it('Should reject when empty', () => {
    const input = []
    var result = actionSequence(input)
    return expect(result).to.eventually.be.rejected
  })
  it('Should reject if no valid words', () => {
    const input = ['','   ','*','*THISISVERYLONGWTFLOLFASF']
    var result = actionSequence(input)

    return expect(result).to.eventually.be.rejected
  })
})

describe('GenerateNames Synonym', () => {
  it('Should return an array', () => {
    return expect(synonymSequence('synonym')).to.eventually.be.an('array')
  })
  it('Should be rejected if empty', () => {
    return expect(synonymSequence('')).to.eventually.eql([])
  })
  it('Should be rejected if empty', () => {
    return expect(synonymSequence('synonym')).to.eventually.eql(['passion', 'hate', 'amour', 'love'])
  })
})

describe('FlattenObject()', () => {
  it('Should return an array', () => {
    return expect(Filter.FlattenObject({data:{"noun":{"syn":["passion","beloved"],"ant":["hate"],"usr":["amour"]},"verb":{"syn":["love","enjoy"],"ant":["hate"]}}}))
    .to.eventually.be.an('array')
  })
  it('Should be rejected if empty', () => {
    return expect(Filter.FlattenObject({})).to.be.rejected
  })
})

describe('RemoveMultiWords()', () => {
  BasicArrayTests(Filter.RemoveMultiWords)

  it('Should return single words', () => {
    const input = ['two words', 'three words three', 'oneword', '']
    return expect(Filter.RemoveMultiWords(input)).to.eventually.eql(['oneword', ''])
  })
})

describe('MergeSynonyms()', () => {
  it('Should return a object', () => {
    const input = [['hello'], {normal: ['world']}]
    return expect(Filter.MergeSynonyms(input)).to.eventually.eql({ normal: ['world'], synonym: ['hello'] })
  })
  it('Should only merge if not empty', () => {
    const input = [[], {normal: ['world']}]
    return expect(Filter.MergeSynonyms(input)).to.eventually.eql({ normal: ['world'] })
  })
})

describe('AddDomainSuffix()', () => {
  it('Should return an array', () => {
    const input = ['hello', 'world']
    const suffix = ['.com', '.fi']

    return expect(Filter.AddDomainSuffix(suffix, input)).to.eventually.be.an('array')
  })
  it('Should add default suffix if empty', () => {
    const input = ['hello', 'world']
    const suffix = []

    return expect(Filter.AddDomainSuffix(suffix, input)).to.eventually.be.eql([ ['hello.com'], ['world.com'] ])
  })

})

describe('RemoveSaved()', () => {
  it('Should return an array', () => {
    const input = [['hello.com'], ['world.fi'], ['test.com']]
    const saved = [ ['hello.com', 'hello.fi'],  ['test.com'] ]

    expect(Filter.RemoveSaved(saved, input)).to.eventually.be.an('array')
    expect(Filter.RemoveSaved(saved, input)).to.eventually.eql([['world.fi']])
  })

})

describe('Complete Action', () => {
  it('Should return an array', () => {
    const syn = 'input'
    const input = ['åäö*','as*df','123', '*qwerty!!!!', '']

    const all = CompleteAction(syn, input)

    return expect(all).to.eventually.be.an('array')
  })
  it('Should reject if input rejects', () => {
    const syn = 'input'
    const input = ['----', '*!!!!', '']

    const all = CompleteAction(syn, input)
    
    return expect(all).to.eventually.be.a('undefined')
  })
  it('Should return array even if synonym is empty', () => {
    const syn = 'input'
    const input = ['this', '*is', 'sparta*']

    const all = CompleteAction(syn, input)
    
    return expect(all).to.eventually.be.a('array')
  })
})
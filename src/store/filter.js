const maxLength = 12

const IfEmptyArray = (input) => {
  if (typeof input !== 'undefined' && input.length !== 0) {
    return true
  }
  return false
}

const ReplaceNordics = (inputArray) => {
  return new Promise((resolve, reject) => {
    if (IfEmptyArray(inputArray)) {
      const output = inputArray.map(x => x
        .replace(/[åäÅÄ]/g, 'a')
        .replace(/[öÖ]/g, 'o'))
      resolve(output)
    } else {
      reject()
    }
  })
}

const LimitLength = (inputArray) => {
  return new Promise((resolve, reject) => {
    if (IfEmptyArray(inputArray)) {
      const output = inputArray.filter(x => x.length < maxLength)
      if (output.length !== 0) {
        resolve(output)
      } else {
        reject()
      }
    } else {
      reject()
    }
  })
}

const RemoveSpecialChars = (inputArray) => {
  return new Promise((resolve, reject) => {
    if (IfEmptyArray(inputArray)) {
      const output = inputArray.map(x => x.replace(/[^a-z*0-9]/gi, '').toLowerCase())
      if (output.length !== 0) {
        resolve(output)
      } else {
        reject()
      }
    } else {
      reject()
    }
  })
}

const RemoveDuplicates = (inputArray) => {
  return new Promise((resolve, reject) => {
    if (IfEmptyArray(inputArray)) {
      let seen = {}
      const output = inputArray.filter(item => {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true)
      })
      resolve(output)
    } else {
      reject()
    }
  })
}

const SortSuffixAndPrefix = (inputArray) => {
  return new Promise((resolve, reject) => {
    let output = { prefix: [], normal: [], suffix: [] }
    inputArray.map(item => {
      if (item.indexOf('*') === 0) {
        output.suffix.push(item.replace(/[*]/g, ''))
      } else if (item.indexOf('*') === item.length - 1) {
        output.prefix.push(item.replace(/[*]/g, ''))
      } else {
        output.normal.push(item.replace(/[*]/g, ''))
      }
    })
    Object.keys(output).map(property => {
      output[property] = output[property].filter(x => x !== '')
      if (output[property].length <= 0) {
        delete output[property]
      }
    })
    if (Object.keys(output).length === 0) {
      reject()
    } else {
      resolve(output)
    }
  })
}

const CombineWords = (inputObject) => {
  return new Promise((resolve, reject) => {
    if (typeof inputObject === 'object' && inputObject !== null) {
      let output = []
      let InputFiltered = []
      Object.keys(inputObject).map(property => {
        if (property !== 'prefix' && property !== 'suffix') {
          InputFiltered.push(property)
        }
      })
      if (inputObject.hasOwnProperty('prefix')) {
        output.push(...inputObject.prefix)
        InputFiltered.map(property => {
          output.push(...CombineArrayWords(inputObject.prefix, inputObject[property]))
        })
        if (inputObject.hasOwnProperty('suffix')) {
          output.push(...CombineArrayWords(inputObject.prefix, inputObject.suffix))
        }
      }
      if (inputObject.hasOwnProperty('suffix')) {
        output.push(...inputObject.suffix)
        InputFiltered.map(property => {
          output.push(...CombineArrayWords(inputObject[property], inputObject.suffix))
        })
      }
      InputFiltered.map(property => {
        output.push(...inputObject[property])
        InputFiltered.map(otherProperty => {
          if (property === 'synonym' && otherProperty === 'synonym') {
            // console.log(property, otherProperty)
          } else {
            output.push(...CombineArrayWords(inputObject[property], inputObject[otherProperty]))
          }
        })
      })
      // console.log(output)
      if (output.length !== 0) {
        resolve(output)
      } else {
        reject()
      }
    } else {
      reject()
    }
  })
}

/*
const CombineWords = (inputObject) => {
  return new Promise((resolve, reject) => {
    if (typeof inputObject === 'object' && inputObject !== null) {
      let output = []
      if (inputObject.hasOwnProperty('prefix')) {
        if (inputObject.hasOwnProperty('normal')) {
          output.push(...CombineArrayWords(inputObject.prefix, inputObject.normal))
        }
        if (inputObject.hasOwnProperty('suffix')) {
          output.push(...CombineArrayWords(inputObject.prefix, inputObject.suffix))
        }
        if (inputObject.hasOwnProperty('synonym')) {
          output.push(...CombineArrayWords(inputObject.prefix, inputObject.synonym))
        }
      }
      if (inputObject.hasOwnProperty('normal')) {
        if (inputObject.hasOwnProperty('suffix')) {
          output.push(...CombineArrayWords(inputObject.normal, inputObject.suffix))
        }
        if (inputObject.hasOwnProperty('synonym')) {
          output.push(...CombineArrayWords(inputObject.normal, inputObject.synonym))
          output.push(...CombineArrayWords(inputObject.synonym, inputObject.normal))
        }
        output.push(...CombineArrayWords(inputObject.normal, inputObject.normal))
        output.push(...inputObject.normal)
      }
      if (inputObject.hasOwnProperty('suffix')) {
        if (inputObject.hasOwnProperty('synonym')) {
          output.push(...CombineArrayWords(inputObject.synonym, inputObject.suffix))
        }
      }
      if (output.length !== 0) {
        resolve(output)
      } else {
        reject()
      }
    } else {
      reject()
    }
  })
}
*/

const CombineArrayWords = (arrayOne, arrayTwo) => {
  let output = new Array(arrayOne.length * arrayTwo.length)
  let count = 0
  arrayOne.map(first => {
    arrayTwo.map(second => {
      output[count] = first + second
      count++
    })
  })
  return output
}

const FlattenObject = (inputObject) => {
  return new Promise((resolve, reject) => {
    inputObject = inputObject.data
    if (typeof inputObject === 'object' && inputObject) {
      let output = []
      Object.keys(inputObject).map(x => {
        Object.keys(inputObject[x]).map(y => {
          output.push(...inputObject[x][y])
        })
      })
      if (output.length !== 0) {
        resolve(output)
      } else {
        reject()
      }
    } else {
      reject()
    }
  })
}

const RemoveMultiWords = (inputArray) => {
  return new Promise((resolve, reject) => {
    if (IfEmptyArray(inputArray)) {
      const output = inputArray.filter(x => x.indexOf(' ') === -1)
      resolve(output)
    } else {
      reject()
    }
  })
}

const MergeSynonyms = (inputArray) => {
  return new Promise((resolve, reject) => {
    if (inputArray[0].length !== 0) {
      inputArray[1].synonym = inputArray[0]
    }
    resolve(inputArray[1])
  })
}

const AddDomainSuffix = (suffixArray, inputArray) => {
  return new Promise((resolve, reject) => {
    if (IfEmptyArray(inputArray)) {
      if (suffixArray.length === 0) {
        suffixArray.push('.com')
      }
      const output = inputArray.map(name => suffixArray.map(suffix => name + suffix))
      resolve(output)
    } else {
      reject()
    }
  })
}

const RemoveSaved = (savedArray, inputArray) => {
  return new Promise((resolve, reject) => {
    if (IfEmptyArray(inputArray)) {
      var saved = {}
      savedArray.map(array => {
        array.map(item => {
          saved[item] = true
        })
      })
      if (Object.keys(saved).length !== 0) {
        const output = inputArray.filter(names => {
          if (names.filter(suffix => saved.hasOwnProperty(suffix)).length === 0) {
            return true
          }
          return false
        })
        /*
        const output = inputArray.filter((x) => {
          if (x.filter(y => saved.includes(y)).length === 0) {
            return true
          }
          return false
        })
        */
        if (output.length !== 0) {
          resolve(output)
        } else {
          reject()
        }
      } else {
        resolve(inputArray)
      }
    } else {
      reject()
    }
  })
}

export default {
  ReplaceNordics,
  LimitLength,
  RemoveSpecialChars,
  RemoveDuplicates,
  SortSuffixAndPrefix,
  CombineWords,
  CombineArrayWords,
  FlattenObject,
  RemoveMultiWords,
  MergeSynonyms,
  AddDomainSuffix,
  RemoveSaved
}

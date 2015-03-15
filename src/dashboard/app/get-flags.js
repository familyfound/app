
export {getStrong, getFlags}

function checkPerson(person, relationships) {
  var flags = getFlags(person, relationships)
  var strong = getStrong(flags)
  return {flags, strong}
}

function getStrong(flags) {
  var strong = []
  strongCriteria.forEach(item => {
    if ('string' === typeof item) item = [item]
    var match = !item.some(flag => {
      var neg = false
      if (flag[0] === '!') {
        flag = flag.slice(1)
        neg = true
      }
      return neg ? flags[flag] : !flags[flag]
    })
    if (match) {
      strong.push(item)
    }
  })
  return strong
}

function getFlags(person, relationships) {
  var flags = {}
  for (var name in flagCheckers) {
    var res = flagCheckers[name](person, relationships)
    if (!res) continue
    flags[name] = res
  }
  return flags
}

var strongCriteria = [
  ['!died before 16', '!living', '!fewer than 110 years', 'no spouse'],
  ['!died before 16', '!living', '!fewer than 110 years', 'invalid spouse'],
  ['!died before 16', '!living', '!fewer than 130 years', 'few children'],
  ['!died before 16', '!living', '!fewer than 130 years', 'no children'],
  'no father',
  'no mother',
  'invalid father',
  'invalid mother',
]

var flagCheckers = {
  'no spouse': function (person, relationships) {
    return !relationships.families.some(family => !!family.spouse)
  },
  'invalid spouse': function (person, relationships) {
    // check for validity
    return false
  },
  'few children': function (person, relationships) {
    return relationships.families.reduce((num, family) => num + family.children.length, 0) < 3
  },
  'no children': function (person, relationships) {
    return relationships.families.reduce((num, family) => num + family.children.length, 0) === 0
  },
  'no mother': function (person, relationships) {
    return !relationships.parents.some(parents => !!parents.mother)
  },
  'no father': function (person, relationships) {
    return !relationships.parents.some(parents => !!parents.father)
  },
  'invalid mother': function (person, relationships) {
    // determine validity
    return false
  },
  'invalid father': function (person, relationships) {
    // determine validity
    return false
  },
  'fewer than 130 years': function (person, relationships) {
    if (!person.display.birthDate) return false // TODO fix
    var parts = person.display.lifespan.split('-')
    if (parts.length !== 2) return false
    var born = parseInt(parts[0], 10)
      , died = parseInt(parts[1], 10)
      , age = died - born
    return new Date().getFullYear() - born < 130
  },
  'fewer than 110 years': function (person, relationships) {
    if (!person.display.birthDate) return false // TODO fix
    var parts = person.display.lifespan.split('-')
    if (parts.length !== 2) return false
    var born = parseInt(parts[0], 10)
      , died = parseInt(parts[1], 10)
      , age = died - born
    return new Date().getFullYear() - born < 110
  },
  'living': (person, _) => person.living,
  'died before 16': function (person) {
    var parts = person.display.lifespan.split('-')
    if (parts.length !== 2) return false
    var born = parseInt(parts[0], 10)
      , died = parseInt(parts[1], 10)
      , age = died - born
    if (isNaN(age)) return false
    return age < 16
  }
}

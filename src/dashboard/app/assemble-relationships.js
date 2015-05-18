
export default function assembleRelationships(pid, relationships, childAndParentsRelationships, persons) {
  var families = []
    , famMap = {}
    , parents = []
    , pMap = persons.reduce((map, person) => {
        map[person.id] = person
        return map
      }, {})
  ;(relationships || []).forEach(rel => {
    if (rel.type !== "http://gedcomx.org/Couple") return
    var spouse = rel.person1.resourceId === pid ? rel.person2.resourceId : rel.person1.resourceId
    famMap[spouse] = {spouse: pMap[spouse], children: []}
    families.push(famMap[spouse])
  })
  ;(childAndParentsRelationships || []).forEach(rel => {
    if (rel.child.resourceId === pid) {
      return parents.push({
        father: rel.father && pMap[rel.father.resourceId],
        mother: rel.mother && pMap[rel.mother.resourceId],
      })
    }
    var spouse = (rel.father && rel.father.resourceId) === pid ? (rel.mother ? rel.mother.resourceId : undefined) : (rel.father ? rel.father.resourceId : undefined);
    if (famMap[spouse]) {
      famMap[spouse].children.push(pMap[rel.child.resourceId])
    } else {
      famMap[spouse] = {
        spouse: pMap[spouse],
        children: [pMap[rel.child.resourceId]],
      }
      families.push(famMap[spouse])
    }
  })
  return {
    families,
    parents,
  }
}


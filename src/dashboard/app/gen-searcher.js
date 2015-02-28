
import Searcher from './searcher'
import assembleRelationships from './assemble-relationships'
import {getFlags, getStrong} from './get-flags'
import {cachedRels} from './api'

export default class GenSearcher extends Searcher {
  constructor (config) {
    Searcher.call(this, config)
    this.persons = {}
    this.relationships = {}
    this.flags = {}
    this.strong = []
    this.tick = config.tick || function(){}
  }
  start (key) {
    Searcher.prototype.start.call(this, key, {up: [], down: []})
  }
  getData (key, done) {
    cachedRels(key, this.config.api, this.config.token, done)
  }
  process (pid, gen, data, done) {
    data.persons.forEach(person =>
      this.persons[person.id] = person
    )

    var relationships = relationshipsFromData(pid, data)
    var flags = getFlags(this.persons[pid], relationships)
    
    this.relationships[pid] = relationships
    this.flags[pid] = flags
    
    var strong = getStrong(flags)
    if (strong.length) {
      this.strong.push({
        pid,
        strong,
        flags,
      })
      if (this.strong.length >= this.config.maxStrong) {
        this.queue.pause()
      }
    }
    // should I add parents?
    if (gen.down.length === 0 && gen.up.length < this.config.maxBack) {
      this.addParents(pid, relationships.parents, gen)
    }
    
    // should I add children?
    if (gen.down.length < this.config.maxDown) {
      this.addChildren(pid, relationships.families, gen)
    }
    
    // TODO think about: should I add spouse?
    
    this.tick(this.persons[pid].display, gen, pid)
    done()
  }
  
  addParents (pid, parents, gen) {
    var ngen = {up: gen.up.concat([pid]), down: []}
      , nprio = 0 + gen.up.length / 1000
      , add = id => this.add(id, ngen, nprio)
    parents.forEach(couple => {
      if (couple.father) {
        add(couple.father.id)
      }
      if (couple.mother) {
        add(couple.mother.id)
      }
    })
  }
  
  addChildren (pid, families, gen) {
    var ngen = {up: gen.up, down: gen.down.concat([pid])}
      , nprio = gen.down.length + gen.up.length / 1000
      , add = id => this.add(id, ngen, nprio)
    families.forEach(family => {
      family.children.forEach(child => add(child.id))
    })
  }
}

function relationshipsFromData(pid, data) {
  return assembleRelationships(
    pid,
    data.relationships,
    data.childAndParentsRelationships,
    data.persons
  )
}


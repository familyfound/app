
import async from 'async'
import EventEmitter from 'eventemitter3'

export default class Searcher extends EventEmitter {
  constructor(config) {
    this.queue = async.priorityQueue(this.fullProcess.bind(this), config.num || 10)
    this.gens = {}
    this.processed = 0
    this.config = config
    this.started = false
  }
  start (key, gen) {
    this.started = true
    if (this.queue.length() && !this.queue.paused) {
      return false
    }
    this.queue.push({key, gen: gen}, 0)
    this.gens[key] = gen
    this.queue.pause()
    this.queue.resume()
  }
  add (key, gen, prio) {
    if (this.gens[key]) return
    this.gens[key] = gen
    this.queue.push({key, gen}, prio)
  }
  fullProcess (datum, done) {
    var key = datum.key
      , gen = datum.gen
    this.getData(key, (err, data) => {
      if (err) {
        console.log('failed to get data for', key, err)
        return done(err)
      }
      this.processed += 1
      this.process.call(this, key, gen, data, done)
    })
  }
  process (key, gen, data, done) {
    done()
  }
  getData (key, done) {
    done(null, null)
  }
}

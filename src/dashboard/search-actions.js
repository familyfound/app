
import ActionCreators from '../flux/action-creators'
var API = 'https://familysearch.org'
import GenSearcher from './app/gen-searcher'
import localForage from 'localforage'

export default class SearchActions extends ActionCreators {
  constructor() {
    super()
  }

  // TODO configure maxDown, etc?
  setup(token, startId) {
    this.searcher = window.searcher = new GenSearcher({
      api: API,
      token: token,
      maxStrong: 5,
      maxBack: 5,
      maxDown: 2,
    })
    this.searcher.on('paused', () => {
      this.emit('paused')
      this.frontierCache.setItem('frontier', this.searcher.queue.tasks)
    })
    this.searcher.on('strong', data => this.emit('strong', data))
    this.searcher.on('started', () => this.emit('started'))
    this.searcher.on('current', (display, gen, pid, num) =>
                      this.emit('current', {display, gen, pid, num}))
      // this.searcher.on('relationships', 

    this.frontierCache = localForage.createInstance({
      name: 'familyfound frontier cache',
      storeName: 'frtontier_cache',
    })

    this.frontierCache.getItem('frontier', (err, frontier) => {
      this.emit('setup', this.searcher.maxStrong)
      if (frontier) {
        this.searcher.queue.tasks = frontier
        this.searcher.queue.pause()
        this.emit('paused')
        // this.searcher.queue.resume()
      } else {
        this.searcher.start(startId)
      }

    })
  }

  get_status() {
    this.emit('status', this.searcher.queue.paused)
  }

  start(key) {
    this.searcher.start(key)
  }

  extend() {
    this.searcher.queue.pause()
    this.searcher.config.maxStrong = this.searcher.strong.length + 5
    this.searcher.queue.resume()
    this.emit('extended', this.searcher.config.maxStrong)
  }
}


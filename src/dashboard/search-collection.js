
import Store from '../flux/store'

export default class SearchStore extends Store {
  constructor() {
    this.status = 'unsetup'
    this.isSetup = false
    this.strong = []
    this.max = null
    super()
  }
}

SearchStore.handlers = {
  search: {
    setup(max) {
      this.max = max
      this.isSetup = true
      this.status = 'unstarted'
      this.changed('isSetup', 'status', 'max')
    },
    extended(max) {
      this.max = max
      this.status = 'running'
      this.changed('status', 'max')
    },
    strong(data) {
      this.strong.push(data)
      this.changed('strong')
    },

    started() {
      this.status = 'running'
      this.changed('status')
    },
    paused() {
      this.status = 'paused'
      this.changed('status')
    },
    status(isPaused) {
      this.status = isPaused ? 'paused' : 'running'
      this.changed('status')
    },
    current(data) {
      this.current = data
      this.changed('current')
    },
  },
}

SearchStore.getters = {
  current() {return this.current},
  isSetup() {return this.isSetup},
  status() {return this.status},
  strong() {return this.strong},
  max() {return this.max},
}


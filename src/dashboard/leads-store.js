
import Store from '../flux/store'
import {PENDING} from '../flux'
import {List, Map} from 'immutable'

export default class LeadsStore extends Store {
  constructor() {
    this.value = null
    this.idSet = new Set()
    this._pending_leads = []
    super()
  }
}

LeadsStore.handlers = {
  leads: {
    loaded(data) {
      this.value = List(data.map(item => Map(item)))
      data.forEach(lead => {
        this.idSet.add(lead.personId)
      })
      this._pending_leads.forEach(lead => {
        if (this.idSet.has(lead.personId)) return
        this.idSet.add(lead.personId)
        this.creators.leads.create(lead)
      })
      this._pending_leads = []
      this.changed()
    },
    loaded__pending() {
      this.value = PENDING
      this.changed()
    },
    loaded__error(error) {
      console.log('failed to get leads...', error)
    },

    created__pending(args) {
      this.value = this.value.push(Map(args[0]))
      this.changed()
    },
  },

  search: {
    strong(data) {
      if (this.value === null || this.value === PENDING) {
        if (this.value === null) {
          this.creators.leads.load()
          this.value = PENDING
        }
        this._pending_leads.push(data)
        return
      }
      if (this.idSet.has(data.personId)) return
      this.idSet.add(data.personId)
      this.creators.leads.create(data)
      this.changed()
    },
  },
}

LeadsStore.getters = {
  value() {
    if (this.value === null) {
      this.creators.leads.load()
    }
    return this.value
  }
}


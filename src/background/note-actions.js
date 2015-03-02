
// import CollectionActions from '../flux/collection-actions'
import ActionCreators from '../flux/action-creators'

export default class NoteActions extends ActionCreators {
  constructor(db, url) {
    this.db = db
    this.url = url
    let table = this.table = db.notes
    super()

    this.addAsyncAction('loaded')
    this.addAsyncAction('created')
    this.addAsyncAction('updated')
    this.addAsyncAction('removed')
  }

  load() {
    let promise = this.url ? this.table.where('url').equalsIgnoreCase(this.url).toArray() : this.table.toArray()
    this.emit('loaded', [], promise)
  }

  update(id, data) {
    data.updated = new Date()
    let promise = this.db.transaction('rw', this.table, () => {
      return this.table.update(id, data).then(numUpdated => {
        if (numUpdated === 0) throw new Error('item was not found')
        return this.table.get(id)
      })
    })
    this.emit('updated', [id, data], promise)
    // mirror up to global `notes` action gropu
    this.baseEmit('notes', 'updated', [id, data], promise)
  }

  remove(id) {
    let promise = this.table.delete(id).then(() => id)
    this.emit('removed', [id], promise)
    // mirror up to global `notes` action gropu
    this.baseEmit('notes', 'removed', [id], promise)
  }

  create(data) {
    data.url = this.url || 'dashboard'
    data.date = new Date()
    let promise = this.table.add(data).then(id => this.table.get(id))
    this.emit('created', [data], promise)
    // mirror up to global `notes` action gropu
    this.baseEmit('notes', 'created', [data], promise)
  }
}


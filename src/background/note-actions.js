
import CollectionActions from '../flux/collection-actions'

export default class NoteActions extends CollectionActions {
  constructor(db, url) {
    this.db = db
    let table = this.table = db.notes

    super({
      load() {
        return table.where('url').equalsIgnoreCase(url).toArray()
      },
      update(id, data) {
        data.updated = new Date()
        return db.transaction('rw', table, () => {
          return table.update(id, data).then(numUpdated => {
            if (numUpdated === 0) throw new Error('item was not found')
            return table.get(id)
          })
        })
      },
      remove(id) {
        return table.delete(id).then(() => id)
      },
      create(data) {
        data.url = url
        data.date = new Date()
        return table.add(data).then(id => table.get(id))
      }
    })
  }
}


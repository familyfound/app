
import CollectionActions from '../flux/collection-actions'

export default class DexieActions extends CollectionActions {
  constructor(db, tableName, reverseSort) {
    this.db = db
    let table = this.table = db[tableName]

    super({
      load() {
        let coll = table//.orderBy('date')
        if (reverseSort) coll = coll.reverse()
        return coll.toArray()
      },
      update(id, data) {
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
        data.date = new Date()
        return table.add(data).then(id => table.get(id))
      }
    })
  }
}


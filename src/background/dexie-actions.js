
import CollectionActions from '../flux/collection-actions'

const gen = () => Math.random().toString(16).slice(2)

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
        console.log('Updating', id, data);
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
        data.id = gen()
        return table.add(data).then(() => table.get(data.id))
      }
    })
  }
}


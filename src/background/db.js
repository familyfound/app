
import Dexie from 'dexie'

export default () => {
  let db = new Dexie('FamilyFound')

  db.version(1).stores({
    pageEvents: '++id, tabid, url, title, prevtabid, prevurl, type',
    editEvents: '++id, url, event, date', // tabid, text (note), metadata
    leads: '++id, pedig, type, personId, date, isHard, *tags', // pedig is a truncated pedigree
    notes: '++id, url, date', // text
    tasks: '++id, personId, url, date, isHard, *tags', // either url or personid will be populated. e.g. can have a task for a source page or sth.
  })
  db.open()
  return db
}


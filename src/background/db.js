
import Dexie from 'dexie'

export default () => {
  let db = new Dexie('FamilyFound')

  db.version(1).stores({
    pageEvents: '++id, tabid, url, title, prevtabid, prevurl, type',

    // tabid, text (note), metadata
    editEvents: '++id, url, event, date',

    // pedig is a truncated pedigree
    leads: '++id, pedig, type, personId, date, isHard, *tags',

    notes: '++id, url, date', // text

    // either url or personid will be populated.
    // e.g. can have a task for a source page or sth.
    tasks: '++id, personId, url, date, isHard, *tags',
  })

  db.version(2).stores({
    pageEvents: '++id, tabid, url, title, prevtabid, prevurl, type, date',

    // tabid, text (note), metadata
    editEvents: '++id, url, event, date',

    // pedig is a truncated pedigree
    leads: '++id, pedig, type, personId, date, isHard, *tags',

    notes: '++id, url, date', // text

    // either url or personid will be populated.
    // e.g. can have a task for a source page or sth.
    tasks: '++id, personId, url, date, isHard, *tags',
  })

  db.version(3).stores({
    pageEvents: '++id, tabid, url, title, prevtabid, prevurl, type, date',

    // tabid, text (note), metadata
    editEvents: '++id, url, event, date',

    // pedig is a truncated pedigree
    leads: '++id, pedig, type, personId, date, isHard, isComplete, *tags',

    notes: '++id, url, date', // text

    // either url or personid will be populated.
    // e.g. can have a task for a source page or sth.
    tasks: '++id, personId, url, date, isHard, *tags',
  })

  db.version(4).stores({
    pageEvents: 'id, tabid, url, title, prevtabid, prevurl, type, date',

    // tabid, text (note), metadata
    editEvents: 'id, url, event, date',

    // pedig is a truncated pedigree
    leads: 'id, pedig, type, personId, date, isHard, isComplete, doLater, *tags',

    notes: 'id, url, date', // text

    // either url or personid will be populated.
    // e.g. can have a task for a source page or sth.
    tasks: 'id, personId, url, date, isHard, *tags',
  })
  db.open()
  return db
}



import FluxServer from '../flux/flux-server'
import ChromeProxy from '../flux/chrome-proxy'

import TabListener from './tab-listener'
import NoteActions from './note-actions'
import DexieActions from './dexie-actions'

import normalizeUrl from './normalize-url'
import setupDb from './db'

let db = setupDb()
let flux = new FluxServer({
  creators: {
    notes: new NoteActions(db),
    pageEvents: new DexieActions(db, 'pageEvents'),
  },
  // the server doesn't have any stores
})

window.chrome.runtime.onConnect.addListener(port => {
  let url = normalizeUrl(port.sender.url)
  flux.addClient({
    proxy: new ChromeProxy(port),
    actions: {
      notes: {
        localAlias: 'notes:' + url,
        creator: new NoteActions(db, url),
      }
    },
  })
})

let tabs = new TabListener(flux.creators.pageEvents)
tabs.listen(window.chrome)


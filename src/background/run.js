
import setupDb from './db'
import TabListener from './tab-listener'
import NoteActions from './note-actions'
import DexieActions from './dexie-actions'
import FluxServer from '../flux/flux-server'
import ChromeProxy from '../flux/chrome-proxy'

let db = setupDb()
let flux = new FluxServer({
  creators: {
    notes: new NoteActions(db),
    pageEvents: new DexieActions(db, 'pageEvents'),
  },
  // the server doesn't have any stores
})

window.chrome.runtime.onConnect.addListener(port => {
  flux.addClient({
    proxy: new ChromeProxy(port),
    actions: {
      notes: {
        localAlias: 'notes:' + port.sender.url,
        creator: new NoteActions(db, port.sender.url),
      }
    },
  })
})

let tabs = new TabListener(flux.creators.pageEvents)
tabs.listen(window.chrome)


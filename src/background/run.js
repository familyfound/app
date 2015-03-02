
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

let dashboardUrl = chrome.runtime.getURL('dashboard/index.html')

window.chrome.runtime.onConnect.addListener(port => {
  // this is the dashboard
  if (port.sender.url.indexOf(dashboardUrl) === 0) {
    flux.addClient({
      proxy: new ChromeProxy(port),
      actions: {
        leads: {
          localAlias: 'leads',
          creator: new DexieActions(db, 'leads'),
        },
        tasks: {
          localAlias: 'tasks',
          creator: new DexieActions(db, 'tasks'),
        },
        notes: {
          localAlias: 'notes',
          creator: new NoteActions(db, null),
        }
      },
    })
    return
  }
  // this is a familysearch page
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



import React from 'react'
import LoginWrapper from './login-wrapper'

import FluxComponent from '../flux/flux-component'

import FluxClient from '../flux/flux-client'
import ChromeProxy from '../flux/chrome-proxy'
import CollectionStore from '../flux/collection-store'

import SearchStore from './search-collection'
import SearchActions from './search-actions'
import LeadsStore from './leads-store'

let port = window.chrome.runtime.connect({name: 'ff-dashboard'})
  , proxy = new ChromeProxy(port)

let flux = new FluxClient({
  // client doesn't own any actions
  stores: {
    notes: new CollectionStore('notes', true),
    leads: new LeadsStore(),
    search: new SearchStore(),
  },
  creators: {
    search: new SearchActions(),
    // leads: new DexieActions(db, 'leads'),
  },
})

flux.connect(proxy).then(() => {
  React.render(<FluxComponent flux={flux} actions={{
    onGotToken: 'search.setup',
  }}>
    <LoginWrapper/>
  </FluxComponent>, document.body)
}).catch(error => {
  console.error(error)
  alert('failed to start up')
})



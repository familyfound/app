
import React from 'react'
import LoginWrapper from './login-wrapper'

import FluxComponent from '../flux/flux-component'

import FluxClient from '../flux/flux-client'
import ChromeProxy from '../flux/chrome-proxy'
import CollectionStore from '../flux/collection-store'

let port = window.chrome.runtime.connect({name: 'ff-dashboard'})
  , proxy = new ChromeProxy(port)

let flux = new FluxClient({
  // client doesn't own any actions
  stores: {
    notes: new CollectionStore('notes', true),
    leads: new CollectionStore('leads', true),
  },
})

flux.connect(proxy).then(() => {
  React.render(<FluxComponent flux={flux}>
    <LoginWrapper/>
  </FluxComponent>, document.body)
}).catch(error => {
  console.error(error)
  alert('failed to start up')
})



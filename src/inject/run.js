import React from 'react'
import setupDb from '../background/db'

// flux libs
import Flux from '../flux/flux'
import FluxClient from '../flux/flux-client'
import ChromeProxy from '../flux/chrome-proxy'
import CollectionStore from '../flux/collection-store'

import FluxComponent from '../flux/flux-component'

// local classes
import Assistant from './'

export default function run(div) {

  if (!window.chrome || !window.chrome.runtime) {
    let db = setupDb()
    let NoteActions = require( '../background/note-actions')

    let flux = new Flux({
      // client doesn't own any actions
      creators: {
        notes: new NoteActions(db, 'local'),
      },
      stores: {
        notes: new CollectionStore('notes', true)
      },
    })

    React.unmountComponentAtNode(div)
    React.render(<FluxComponent flux={flux}><Assistant/></FluxComponent>, div)

  } else {
    let port = window.chrome.runtime.connect({name: 'FFClient'})
      , proxy = new ChromeProxy(port)

    // setup flux
    let flux = new FluxClient({
      // client doesn't own any actions
      stores: {
        notes: new CollectionStore('notes', true)
      },
    })

    flux.connect(proxy).then(() => {
      React.unmountComponentAtNode(div)
      React.render(<FluxComponent flux={flux}><Assistant dashboardUrl={chrome.runtime.getURL('dashboard/index.html')}/></FluxComponent>, div)
    }).catch(error => {
      console.error(error)
      alert('failed to start up')
    })
  }
}

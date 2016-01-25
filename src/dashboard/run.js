
import React from 'react'

import FluxComponent from '../flux/flux-component'

import FluxClient from '../flux/flux-client'
import ChromeProxy from '../flux/chrome-proxy'
import CollectionStore from '../flux/collection-store'

import LeadsStore from './leads-store'
import SearchActions from './search-actions'
import SearchStore from './search-collection'
import UserActions from './user-actions'
import UserStore from './user-store'

import renderRouter from './router'

var API = 'https://familysearch.org'
import {getUser} from './app/api'

const start = (token, user) => {
  let port = window.chrome.runtime.connect({name: 'ff-dashboard'})
    , proxy = new ChromeProxy(port)

  let flux = new FluxClient({
    // client doesn't own any actions
    stores: {
      notes: new CollectionStore('notes', true),
      leads: new LeadsStore(),
      search: new SearchStore(),
      user: new UserStore(token, user),
    },
    creators: {
      search: new SearchActions(),
      user: new UserActions(),
    },
  })

  flux.connect(proxy).then(() => {
    window.flux = flux
    renderRouter(flux, document.body)
  })

  setInterval(() => {
    if (flux.stores.user.token) {
      flux.creators.user.check(flux.stores.user.token);
    } else {
      // flux.creators.user.login();
    }
  }, 5 * 60 * 1000);
}

if (localStorage.ffToken) {
  getUser(API, localStorage.ffToken, (err, user) => {
    if (err) {
      delete localStorage.ffToken;
      start(null, null);
    } else {
      start(localStorage.ffToken, user);
    }
  });
} else {
  start(null, null);
}


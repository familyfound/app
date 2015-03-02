
import React from 'react/addons'

import FluxComponent from '../flux/flux-component'
import LeadsPage from './pages/leads'

import {getUser} from './app/api'

var API = 'https://familysearch.org'

export default React.createClass({
  render() {
    return <FluxComponent stateFromStores={{
      user: {
        value: 'value',
        loggedout: 'loggedout',
      },
      search: {
        status: 'status',
        current: 'current',
      },
      leads: true,
    }} actions={{
      onStart: 'search.start',
      onExtend:'search.extend',
    }}><LeadsPage/></FluxComponent>
  }
})



import React from 'react/addons'

import NotesPage from './pages/notes'
import FluxComponent from '../flux/flux-component'
import LeadsPage from './pages/leads'
// import GenSearcher from './app/gen-searcher'

import {getUser} from './app/api'

var API = 'https://familysearch.org'

export default React.createClass({
  getInitialState() {
    return {
      loading: true,
      user: null,
    }
  },

  componentDidMount() {
    chrome.cookies.get({
      url: 'https://familysearch.org/',
      name: 'fssessionid',
    }, (cookie) => {
      if (!cookie) return this.setState({loading: false})
      this.loggedIn(cookie.value)
    })
  },

  loggedIn(token) {
    this.setState({token})

    getUser(API, token, (err, user) => {
      if (err) {
        return this._onInvalidLogin()
      }

      this.props.onGotToken(token, user.personId)

      /*
      var searcher = window.searcher = new GenSearcher({
        api: API,
        token: token,
        maxStrong: 5,
        maxBack: 5,
        maxDown: 2,
      })
      */

      this.setState({user, loading: false})
    })
  },

  _onInvalidLogin() {
    this.setState({user: null, token: false, loading: false})
  },

  render() {
    if (!window.chrome || !window.chrome.runtime) {
      return <h1 className='LoadingWrap'>This app requires a chrome extensions</h1>
    }
    if (this.state.loading) {
      return <h1 className='LoadingWrap'>Connecting to familysearch</h1>
    }
    if (!this.state.user) {
      return <h1 className='LoadingWrap LoadingWrap-login'>Please login to familysearch <a href="https://familysearch.org" target="_blank">here</a></h1>
    }
    //return <LeadsPage
        //user={this.state.user}/>
    return <div>
      <FluxComponent stateFromStores={{
        search: {
          status: 'status',
          current: 'current',
        },
        leads: true,
      }} actions={{
        onStart: 'search.start',
        onExtend:'search.extend',
      }}>
        <LeadsPage
          user={this.state.user}/>
      </FluxComponent>
      <NotesPage/>
    </div>
  }
})


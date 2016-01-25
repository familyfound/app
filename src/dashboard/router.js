
import React from 'react'
import Router from 'react-router'
import FluxComponent from '../flux/flux-component'

let {DefaultRoute, Link, RouteHandler, Route} = Router

import LeadsPage from './pages/leads'
import LogPage from './pages/log'
import ExplorePage from './pages/explore'
import SettingsPage from './pages/settings'

let App = React.createClass({
  render() {
    return <div className='App'>
      <FluxComponent rerender={{}} stateFromStores={{
        user: true,
      }}><Header/></FluxComponent>
      <div className='App_body'>
        <RouteHandler/>
      </div>
    </div>
  }
})

const logout = () => {
  delete localStorage.ffToken;
  delete localStorage.treeUserId;
  window.location.reload();
}

let Header = React.createClass({
  render() {
    return <header className='Header'>
      <div className='Header_brand'>
        FamilyFound
      </div>
      {/* TODO are any of these tabs useful right now?
      <div className='Header_links'>
        <Link to="leads">Find Leads</Link>
        <Link to="log">Research Log</Link>
        <Link to="explore">Explore your Tree</Link>
        <Link to="settings">Settings</Link>
      </div>
      */}
      <div className='Header_greeting'>
        {(this.props.user && this.props.user.displayName) ? 'Hello ' + this.props.user.displayName : null}
        {this.props.user && <button onClick={logout} className='App_logout'>
          Logout
        </button>}
      </div>
    </header>
  }
})

let routes = <Route handler={App} path="/">
  <DefaultRoute name="leads" handler={LeadsPage}/>
  <Route name="log" handler={LogPage}/>
  <Route name="explore" handler={ExplorePage}/>
  <Route name="settings" handler={SettingsPage}/>
</Route>

export default function renderRouter(flux, target) {
  Router.run(routes, Handler => {
    React.render(<FluxComponent rerender={{}} flux={flux}><Handler/></FluxComponent>, target)
  })
}


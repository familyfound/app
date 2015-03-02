
import React from 'react'
import Router from 'react-router'
import FluxComponent from '../flux/flux-component'

let {DefaultRoute, Link, RouteHandler, Route} = Router

import LoginWrapper from './login-wrapper'
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

let Header = React.createClass({
  render() {
    return <header className='Header'>
      <div className='Header_brand'>
        FamilyFound
      </div>
      <div className='Header_links'>
        <Link to="leads">Find Leads</Link>
        <Link to="log">Research Log</Link>
        <Link to="explore">Explore your Tree</Link>
        <Link to="settings">Settings</Link>
      </div>
      <div className='Header_greeting'>
        {this.props.user ? 'Hello ' + this.props.user.displayName : null}
      </div>
    </header>
  }
})

let LeadsPageWrap = React.createClass({
  render() {
    return <FluxComponent actions={{
      onGotToken: 'search.setup',
    }}>
      <LoginWrapper/>
    </FluxComponent>
  }
})

let routes = <Route handler={App} path="/">
  <DefaultRoute name="leads" handler={LeadsPageWrap}/>
  <Route name="log" handler={LogPage}/>
  <Route name="explore" handler={ExplorePage}/>
  <Route name="settings" handler={SettingsPage}/>
</Route>

export default function renderRouter(flux, target) {
  Router.run(routes, Handler => {
    React.render(<FluxComponent rerender={{}} flux={flux}><Handler/></FluxComponent>, target)
  })
}


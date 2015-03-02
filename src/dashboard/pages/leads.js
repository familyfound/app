
import React from 'react'

import {PENDING} from '../../flux'

import Leads from '../app/leads'
import Fan from '../app/fan'
import classnames from 'classnames'

export default React.createClass({
  getInitialState() {
    return {
      current: null,
    }
  },

  _onStart() {
    this.props.onStart(this.props.user.personId)
  },

  _searchMore() {
    this.props.onExtend()
  },

  render() {
    if (!window.chrome || !window.chrome.runtime) {
      return <h1 className='LoadingWrap'>This app requires a chrome extensions</h1>
    }
    if (this.props.loggedout) {
      return <h1 className='LoadingWrap LoadingWrap-login'>
        Please login to familysearch <a href="https://familysearch.org" target="_blank">here</a>
      </h1>
    }
    if (!this.props.value || this.props.value === PENDING) {
      return <div className='LeadsPage'>
        Connecting to FamilySearch
      </div>
    }
    if (this.props.status === 'unstarted') {
      return <div className='LeadsPage'>
          <button className='App_start' onClick={this._onStart}>
            Start searching!
          </button>
        </div>
    }
    return <div className='LeadsPage'>
      {/*{localStorage.SHOW_FAN ? <Fan root={this.props.user.personId}
            relationships={this.props.searcher.relationships}/> : null}*/}
      <div className={classnames('App_status', this.props.status === 'paused' ? 'App_status-paused' : '')}>
        {this.props.status === 'running' ?
          <Body current={this.props.current}/> :
          <button className='App_searchmore' onClick={this._searchMore}>Find me 5 more!</button>}
      </div>
      <Leads leads={this.props.leads}/>
    </div>
  }
})

let Body = React.createClass({
  render() {
    let display = this.props.current ? this.props.current.display : null
    return <div className='SearchProgress'>
      {/*<h3>Finding interesting things for you!</h3>*/}
      <div>Processed: {this.props.current ? this.props.current.num : 0}</div>
      {this.props.current &&
      <div>
        {display.name} <em>{display.lifespan}</em>
        {/*<Person display={this.props.current.display}/>*/}
      </div>}
    </div>
  }
})

let Person = React.createClass({
  render() {
    return <div className='Person'>
      <strong>{this.props.display.name}</strong>
      <em>{this.props.display.lifespan}</em>
      <br/>
      {this.props.display.birthDate}{' '}
      {this.props.display.birthPlace}<br/>
      {this.props.display.deathDate}{' '}
      {this.props.display.deathPlace}
    </div>
  }
})


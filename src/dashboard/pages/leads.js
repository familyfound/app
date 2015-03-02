
import React from 'react'

import Leads from '../app/leads'
import Fan from '../app/fan'
import classnames from 'classnames'
import NotesPage from './notes'

export default React.createClass({
  getInitialState() {
    return {
      current: null,
    }
  },

  _onUpdate(display, gen, pid) {
    this.setState({
      current: {display, gen, pid}
    })
  },

  _onStart() {
    this.props.onStart(this.props.user.personId)
  },

  _searchMore() {
    this.props.onExtend()
  },

  render() {
    var header = <div className='App_header'>
      <div className='App_brand'>
        FamilyFound
      </div>
      <div className='App_greeting'>
        Hello {this.props.user.displayName}
      </div>
    </div>
    if (this.props.status === 'unstarted') {
      return <div className='App'>
        {header}
        <div className='App_body'>
          <button className='App_start' onClick={this._onStart}>
            Start searching!
          </button>
        </div>
      </div>
    }
    return <div className='App'>
      {header}
      <div className='App_body'>
        {/*{localStorage.SHOW_FAN ? <Fan root={this.props.user.personId}
              relationships={this.props.searcher.relationships}/> : null}*/}
        <div className={classnames('App_status', this.props.status === 'paused' ? 'App_status-paused' : '')}>
          {this.props.status === 'running' ?
            <Body current={this.props.current}/> :
            <button className='App_searchmore' onClick={this._searchMore}>Find me 5 more!</button>}
        </div>
        <Leads leads={this.props.leads}/>
      </div>
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


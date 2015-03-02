
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

  componentWillMount() {
    this.props.searcher.tick = this._onUpdate
  },

  _onUpdate(display, gen, pid) {
    this.setState({
      current: {display, gen, pid}
    })
  },

  _onStart() {
    this.props.searcher.start(this.props.user.personId)
    this.setState({started: true})
  },

  _searchMore() {
    this.props.searcher.config.maxStrong += 5
    this.props.searcher.queue.resume()
    this.setState({more: true})
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
    if (!this.props.searcher.started) {
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
        {localStorage.SHOW_FAN ? <Fan root={this.props.user.personId}
            relationships={this.props.searcher.relationships}/> : null}
        <div className={classnames('App_status', this.props.searcher.queue.paused ? 'App_status-paused' : '')}>
          {(false || !this.props.searcher.queue.paused) ?
            <Body processed={this.props.searcher.processed}
              current={this.state.current}/> :
            <button className='App_searchmore' onClick={this._searchMore}>Find me 5 more!</button>}
        </div>
        <Leads searcher={this.props.searcher}/>
      </div>
      <NotesPage/>
    </div>
  }
})

let Body = React.createClass({
  render() {
    let display = this.props.current ? this.props.current.display : null
    return <div className='SearchProgress'>
      {/*<h3>Finding interesting things for you!</h3>*/}
      <div>Processed: {this.props.processed}</div>
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


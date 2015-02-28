
import React from 'react/addons'
import {getUser} from './api'
import Leads from './leads'
import Fan from './fan'
import classnames from 'classnames'

let App = React.createClass({
  getInitialState() {
    return {
      user: null,
      userError: null,
    }
  },

  componentWillMount() {
    getUser(this.props.api, this.props.token, (err, user) => {
      if (err) {
        return this.props.invalidLogin()
        // return this.setState({userError: err})
      }
      this.setState({user: user})
    })
  },

  render() {
    if (this.state.userError) {
      return <h3 className='App App-noconnect'>Sorry, couldn't connect to familysearch.</h3>;
    }
    if (!this.state.user) {
      return <div className='App App-loadinguser'>Loading user...</div>
    }
    var header = <div className='App_header'>
      <div className='App_brand'>
        FamilyFound
      </div>
      <div className='App_greeting'>
        Hello {this.state.user.displayName}
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
        <Fan root={this.state.user.personId}
          relationships={this.props.searcher.relationships}/>
        <div className={classnames('App_status', this.props.searcher.queue.paused ? 'App_status-paused' : '')}>
          {!this.props.searcher.queue.paused && 'Searching...'}
          {this.props.searcher.queue.paused &&
            <button className='App_searchmore' onClick={this._searchMore}>Find me 5 more!</button>}
        </div>
        <Body processed={this.props.searcher.processed}
          current={this.state.current}/>
        <Leads searcher={this.props.searcher}/>
      </div>
    </div>
  }
})

export default App


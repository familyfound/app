
import React from 'react'
import StrongLead from './strong-lead'
import {PENDING} from '../../flux'
import classnames from 'classnames'

var Leads = React.createClass({
  propTypes: {
    leads: React.PropTypes.object,
  },
  _onUpdate(id, data) {
    this.props.onUpdate(id, data)
  },
  getInitialState() {
    return {
      filter: 'fresh',
    }
  },
  render: function () {
    if (!this.props.leads || this.props.leads === PENDING) {
      return <em>Looking for some leads...</em>
    }
    let {leads} = this.props
    let filterTypes = {
      fresh: strong => !strong.isComplete && !strong.doLater,
      later: strong => strong.doLater,
      complete: strong => strong.isComplete,
      all: strong => true,
    }
    leads = leads.toJS()
    if (this.state.filter !== 'all') {
      leads = leads.filter(filterTypes[this.state.filter])
    }
    return <div className='Leads'>
      <h2 className='Leads_title'>Strong Research Leads <span className='Leads_badge'>{leads.length}</span></h2>
      <ul className='Leads_filter'>
        {Object.keys(filterTypes).map(type => <li onClick={() => this.setState({filter: type})} className={
          classnames('Leads_filter_type', type === this.state.filter && 'Leads_filter_type-active')
        }>{type}</li>)}
      </ul>
      <ul className='Leads_list'>
        {leads.map(strong =>
          <li><StrongLead
            pid={strong.personId}
            onUpdate={this._onUpdate.bind(null, strong.id)}
            display={strong.display}
            strongs={strong.strong}
            note={strong.note}
            gen={strong.gen}
            flags={strong.flags}
            // person={searcher.persons[strong.pid]}
            // relationships={searcher.relationships[strong.pid]}
            /></li>)}
      </ul>
      {/*
      <table>
        <thead>
          {'Name|Relation|Lifespan|Age|Reason|'.split('|').map(title => <th>{title}</th>)}
        </thead>
        <tbody>
        {leads.toJS().map(strong =>
          strong.isDone ? null : <StrongLead
            pid={strong.personId}
            onDone={this._onDone.bind(null, strong.id)}
            display={strong.display}
            strongs={strong.strong}
            gen={strong.gen}
            flags={strong.flags}
            // person={searcher.persons[strong.pid]}
            // relationships={searcher.relationships[strong.pid]}
            />)}
      </tbody></table>*/}
    </div>
  }
})
          /*<FluxComponent
            pid={strong.pid}
            stateFromStores={{
              fsdata: (props, getters) => ({
                person: getters.person(props.pid),
                relationships: getters.relationships(props.pid),
              })
            }}
            >*/

export default Leads


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
    console.log('LEADS', this.props.leads.toJS());
    let {leads} = this.props
    let filterTypes = {
      fresh: strong => !strong.isComplete && !strong.doLater,
      later: strong => strong.doLater && !strong.isComplete,
      complete: strong => strong.isComplete,
      all: strong => true,
    }
    leads = leads.toJS()
    if (this.state.filter !== 'all') {
      leads = leads.filter(filterTypes[this.state.filter])
    }

    return <div className='Leads'>
      <h2 className='Leads_title'>
        Strong Research Leads
        <span className='Leads_badge'>
          {leads.length}
        </span>
      </h2>
      <ul className='Leads_filter'>
        {Object.keys(filterTypes).map(type => (
          <li
            onClick={() => this.setState({filter: type})}
            className={
              classnames(
                'Leads_filter_type',
                type === this.state.filter &&
                  'Leads_filter_type-active'
              )
            }
          >{type}</li>
        ))}
      </ul>

      <ul className='Leads_list'>
        {leads.map(strong =>
          <li key={strong.personId}><StrongLead
            pid={strong.personId}
            onUpdate={this._onUpdate.bind(null, strong.id)}
            finished={strong.isComplete}
            display={strong.display}
            strongs={strong.strong}
            later={strong.doLater}
            flags={strong.flags}
            note={strong.note}
            gen={strong.gen}
            // person={searcher.persons[strong.pid]}
            // relationships={searcher.relationships[strong.pid]}
            /></li>)}
      </ul>
    </div>
  }
})

export default Leads

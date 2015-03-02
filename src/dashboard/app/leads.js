
import React from 'react'
import StrongLead from './strong-lead'
import {PENDING} from '../../flux'

var Leads = React.createClass({
  propTypes: {
    leads: React.PropTypes.object,
  },
  render: function () {
    if (!this.props.leads || this.props.leads === PENDING) {
      return <em>Looking for some leads...</em>
    }
    let {leads} = this.props
    return <div className='Leads'>
      <h2 className='Leads_title'>Strong Research Leads <span className='Leads_badge'>{leads.size}</span></h2>
      <table>
        <thead>
          {'Name|Up|Down|Lifespan|Age|Reason|'.split('|').map(title => <th>{title}</th>)}
        </thead>
        <tbody>
        {leads.toJS().map(strong =>
          <StrongLead
            pid={strong.personId}
            display={strong.display}
            strongs={strong.strong}
            gen={strong.gen}
            flags={strong.flags}
            // person={searcher.persons[strong.pid]}
            // relationships={searcher.relationships[strong.pid]}
            />)}
      </tbody></table>
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


import React from 'react'
import StrongLead from './strong-lead'

var Leads = React.createClass({
  propTypes: {
    searcher: React.PropTypes.object,
  },
  render: function () {
    if (!this.props.searcher.strong.length) {
      return <em>Looking for some leads...</em>
    }
    var {searcher} = this.props
    return <div className='Leads'>
      <h2 className='Leads_title'>Strong Research Leads <span className='Leads_badge'>{searcher.strong.length}</span></h2>
      <table>
        <thead>
          {'Name|Up|Down|Lifespan|Age|Reason|'.split('|').map(title => <th>{title}</th>)}
        </thead>
        <tbody>
        {searcher.strong.map(strong =>
          <StrongLead
            pid={strong.pid}
            gen={searcher.gens[strong.pid]}
            strongs={strong.strong}
            flags={strong.flags}
            person={searcher.persons[strong.pid]}
            relationships={searcher.relationships[strong.pid]}
        />)}
      </tbody></table>
    </div>
  }
})

export default Leads

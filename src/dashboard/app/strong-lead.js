
import React from 'react'

var StrongLead = React.createClass({
  propTypes: {
    strongs: React.PropTypes.array,
    flags: React.PropTypes.object,
    person: React.PropTypes.object,
    pid: React.PropTypes.string,
    relationships: React.PropTypes.object,
  },
  render: function () {
    var {person, pid} = this.props
    var age = new Date(person.display.deathDate).getFullYear() - new Date(person.display.birthDate).getFullYear()
    if (isNaN(age)) age = ''
    return <tr>
      <td><strong>{person.display.name}</strong><br/>
      {person.display.birthDate} {person.display.birthPlace}<br/>
      {person.display.deathDate} {person.display.deathPlace}
      </td>
      <td>{this.props.gen.up.length}</td>
      <td>{this.props.gen.down.length}</td>
      <td>{person.display.lifespan}</td>
      <td>{age}</td>
      <td>{this.props.strongs.map(l => l[l.length-1]).join(' | ')}</td>
      <td><a href={"https://familysearch.org/tree/#view=ancestor&person=" + pid} target="_blank">Link</a></td>
    </tr>
  }
})

export default StrongLead

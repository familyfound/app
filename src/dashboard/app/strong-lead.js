
import React from 'react'
let {PropTypes: PT} = React

var StrongLead = React.createClass({
  propTypes: {
    display: PT.object,
    strongs: PT.array,
    flags: PT.object,
    // person: PT.object,
    pid: PT.string,
    // relationships: PT.object,
  },
  render: function () {
    var {display, pid} = this.props
    var age = new Date(display.deathDate).getFullYear() - new Date(display.birthDate).getFullYear()
    if (isNaN(age)) age = ''
    return <tr>
      <td><strong>{display.name}</strong><br/>
      {display.birthDate} {display.birthPlace}<br/>
      {display.deathDate} {display.deathPlace}
      </td>
      <td>{this.props.gen.up.length}</td>
      <td>{this.props.gen.down.length}</td>
      <td>{display.lifespan}</td>
      <td>{age}</td>
      <td>{this.props.strongs.map(l => l[l.length-1]).join(' | ')}</td>
      <td><a href={"https://familysearch.org/tree/#view=ancestor&person=" + pid} target="_blank">Link</a></td>
    </tr>
  }
})

export default StrongLead

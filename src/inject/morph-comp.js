
import React from 'react'
import MorphMixin from './morpher'

export default React.createClass({
  mixins: [MorphMixin()],
  render() {
    return <div>
      {this.props.children}
    </div>
  }
})


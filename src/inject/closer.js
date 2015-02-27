
import React from 'react'
import cx from 'classnames'
import MorphMixin from './morph'

export default React.createClass({
  mixins: [MorphMixin],
  getInitialState() {
    return {closed: false}
  },
  _toggleClosed() {
    this.setState({closed: !this.state.closed})
  },
  render() {
    if (this.state.closed) {
      return <div className={cx(this.props.className, 'Closer Closer-closed')} onClick={this._toggleClosed}>OO</div>
    }
    return <div className={cx(this.props.className, 'Closer')}>
      <div className='Closer_closer' onClick={this._toggleClosed}>&times;</div>
      {this.props.children}
    </div>
  }
})


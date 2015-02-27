
import React from 'react'
import assign from 'object-assign'
import MorphMixin from './morph'

export default React.createClass({
  mixins: [MorphMixin],

  getInitialState() {
    return {open: false}
  },

  _onCancel() {
    this.setState({open: false})
  },

  _onOpen() {
    this.setState({open: true})
  },

  process(child) {
    return crawlChild(child, child => {
      if (!child.props.opener) return {}
      let opener = child.props.opener
      let props = {opener: undefined}
      for (let name in opener) {
        let val = opener[name]
        if ('string' === typeof val) {
          props[name] = val === 'open' ? this._onOpen : this._onCancel
        } else {
          props[name] = (...args) => {
            val.forEach(item => {
              if ('function' === typeof item) item(...args)
              else this[item === 'open' ? '_onOpen' : '_onCancel']()
            })
          }
        }
      }
      return props
    })
  },

  render() {
    if (this.props.children.length !== 2) {
      throw new Error('must have two children')
    }
    return this.process(this.props.children[this.state.open ? 1 : 0])
  }
})

function crawlChild(child, fn) {
  if (!child || !child.props) return child
  return React.addons.cloneWithProps(child, assign({
    children: React.Children.map(child.props.children, child => crawlChild(child, fn))
  }, fn(child)))
}


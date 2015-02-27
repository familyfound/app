
export default function () {
  return {
    componentWillUpdate() {
      var node = this.getDOMNode()
      this._width = 'initial'
      this._height = 'initial'
      var st = node.getBoundingClientRect()
      this._transition = node.style.transition
      node.style.transition = 'initial'
      node.style.height = st.height + 'px'
      node.style.width = st.width + 'px'
    },

    componentDidUpdate() {
      var node = this.getDOMNode()
      var bef = window.getComputedStyle(node)
        , height = bef.height
        , width = bef.width
        , oheight = this._height
        , owidth = this._width
        , otransition = this._transition
      node.style.transition = 'initial'
      node.style.height = oheight
      node.style.width = owidth
      var aft = window.getComputedStyle(node)
        , awidth = aft.width
        , aheight = aft.height
      if (awidth === width && aheight === height) {
        node.style.removeProperty('height')
        node.style.removeProperty('width')
        return
      }
      node.style.height = height
      node.style.width = width
      node.style.overflow = 'hidden'
      node.offsetWidth
      node.offsetHeight
      node.style.transition = 'width .3s ease, height .3s ease'
      node.style.height = aheight
      node.style.width = awidth
      var done = () => {
        node.style.removeProperty('transition')
        node.style.removeProperty('overflow')
        node.style.removeProperty('height')
        node.style.removeProperty('width')
        delete this._tout
      }
      if (this._tout) {
        clearTimeout(this._tout)
      }
      this._tout = setTimeout(done, 300)
    }
  }
}

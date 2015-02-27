
var Morph = {
  componentWillUpdate() {
    if (this._tout) {
      clearTimeout(this._tout)
      delete this._tout
    }
    // console.log('will')
    var node = this.getDOMNode()
    this._width = node.style.width
    this._height = node.style.height
    var st = window.getComputedStyle(node)
    this._transition = node.style.transition
    node.style.transition = 'initial'
    node.style.height = st.height
    node.style.width = st.width
  },

  componentDidUpdate() {
    var node = this.getDOMNode()
    var bef = window.getComputedStyle(node)
      , height = bef.height
      , width = bef.width
      , oheight = this._height
      , owidth = this._width
      , otransition = this._transition
    console.log(height, width, oheight, owidth)
    node.style.transition = 'initial'
    node.style.height = oheight
    node.style.width = owidth
    var aft = window.getComputedStyle(node)
      , awidth = aft.width
      , aheight = aft.height
    console.log(awidth, width, aheight, height)
    if (awidth === width && aheight === height) {return}
    node.style.height = height
    node.style.width = width
    var ooverflow = node.style.overflow
      , otransition = node.style.transition
    node.style.overflow = 'hidden'
    node.offsetWidth
    node.offsetHeight
    node.style.transition = 'width .3s ease, height .3s ease'
    node.style.height = aheight
    node.style.width = awidth
    var done = () => {
      node.style.transition = otransition
      node.style.overflow = ooverflow
      node.style.height = oheight
      node.style.width = owidth
      node.removeEventListener('transitionend', done)
      delete this._tout
    }
    this._tout = setTimeout(done, 300)
  }
}

module.exports = Morph


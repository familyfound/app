
import React from 'react/addons'

let {classSet: cx} = React.addons

function getGenPos(num, sweep, dist) {
	var gen = Math.floor(Math.log(num)/Math.log(2))
  var lev = Math.pow(2, gen)
  var over = (num - lev + .5) / lev
  if (!gen) return {x:0,y:0}
  var correct = ((sweep / 2) - .5) * Math.PI
  var theta = Math.PI * sweep * over + Math.PI - correct
  return {
  	x: Math.cos(theta) * dist,
  	y: Math.sin(theta) * dist,
  }
}

function pie(x, y, t1, r) {
	var x1 = Math.cos(0) * r + x
    , y1 = Math.sin(0) * r + y
    , x2 = Math.cos(t1) * r + x
    , y2 = Math.sin(t1) * r + y
  return `M${x1} ${y1} A ${r} ${r}, 0, ${t1 < Math.PI ? 0 : 1}, 1, ${x2} ${y2} L ${x} ${y} Z`
}

let Node = React.createClass({
  getDist(rad) {
    return this.props.dist + rad + 10
  },

  getParents(dist) {
    let rel = this.props.relationships[this.props.id]
    let parents = []
    if (rel && rel.parents && rel.parents.length) {
      // TODO look for a complete set of parents, if multiple
      if (rel.parents[0].father) {
      	parents.push(<Node
          dist={dist}
          id={rel.parents[0].father.id}
          relationships={this.props.relationships}
          num={this.props.num*2} gen={this.props.gen+1}/>)
      }
      if (rel.parents[0].mother) {
        parents.push(<Node
          dist={dist}
          id={rel.parents[0].mother.id}
          relationships={this.props.relationships}
          num={this.props.num*2+1} gen={this.props.gen+1}/>)
      }
    }
    return parents
  },

  renderLoading(pos, rad) {
    let rel = this.props.relationships[this.props.id]
    if (!rel) return
    var total = 0
      , loaded = 0
      , gtotal = 0
      , gloaded = 0
    rel.families.forEach(fam => fam.children.forEach(ch => {
      total += 1
      if (this.props.relationships[ch.id]) {
        loaded += 1
        // grandbabies!!
        this.props.relationships[ch.id].families.forEach(fam => fam.children.forEach(ch => {
          gtotal += 1
          if (this.props.relationships[ch.id]) {
            gloaded += 1
          }
        }))
      }
    }))
    if (!total) return
    if (total === loaded) {
      if (!gtotal || !gloaded) {
        return <circle cx={pos.x} cy={pos.y} r={rad + 3} className='Node_loaded'/>
      }
      if (gtotal === gloaded) {
        return [
          <circle cx={pos.x} cy={pos.y} r={rad + 6} className='Node_gloaded'/>,
          <circle cx={pos.x} cy={pos.y} r={rad + 3} className='Node_loaded'/>
        ]
      }
      return [
        <circle cx={pos.x} cy={pos.y} r={rad + 6} className='Node_gloading-back'/>,
        <path
          d={pie(pos.x, pos.y, Math.PI * 2 * (gloaded / gtotal), rad + 6)}
          className='Node_gloading'/>,
        <circle cx={pos.x} cy={pos.y} r={rad + 3} className='Node_loaded'/>
      ]
    }
    return [
      <circle cx={pos.x} cy={pos.y} r={rad + 3} className='Node_loading-back'/>,
      <path
        d={pie(pos.x, pos.y, Math.PI * 2 * (loaded / total), rad + 3)}
        className='Node_loading'/>
    ]
  },

	render() {
    let rad = 30 - this.props.gen*3.5
    let dist = this.getDist(40 - this.props.gen * 2)
  	let pos = getGenPos(this.props.num, 1.3, dist)
    let rel = this.props.relationships[this.props.id]
    let others = this.getParents(dist)
  	return <g
      transform={this.props.transform}
      className={cx({
        'Node': true,
        ['gen-' + this.props.gen]: true,
        'Node-processed': !!rel,
        'Node-pending': !rel,
      })}>
      {this.renderLoading(pos, rad)}
    	<circle
        cx={pos.x}
        cy={pos.y}
        r={rad}/>
      {others}
    </g>
  },
})

let Fan = React.createClass({
  render() {
    return <svg width={700} height={480}>
      <Node
        gen={0}
        num={1}
        dist={0}
        id={this.props.root}
        relationships={this.props.relationships}
        transform="translate(350, 330)"/>
    </svg>
  }
})

export default Fan


import React from 'react'
let {PropTypes: PT} = React

let relationMap = {
  '1|0|Male': 'Father',
  '1|0|Female': 'Mother',
  '2|0|Male': 'Grandfather',
  '2|0|Female': 'Grandmother',
  '3|0|Male': 'Great-Grandfather',
  '3|0|Female': 'Great-Grandmother',

  '1|1|Male': 'Brother',
  '1|1|Female': 'Sister',
  '2|1|Male': 'Uncle',
  '2|1|Female': 'Aunt',
  '2|2|Male': 'Cousin',
  '2|2|Female': 'Cousin',
}

const arkUrl = pid => `https://familysearch.org/ark:/61903/4:1:${pid}?context=detail`;

function stnd(num) {
  if (num > 10 && num < 20) return num + 'th'
  let ends = ['th', 'st', 'nd', 'rd', 'th']
  return num + (ends[num % 10] || 'th')
}

function ce(num) {
  return ['None', 'Once', 'Twice', 'Thrice'][num] || (num + 'x')
}

function relationText(up, down, gender) {
  let key = up + '|' + down + '|' + gender
  if (relationMap[key]) return relationMap[key]
  if (!down) {
    return stnd(up - 2) + ' Great-Grand' + (gender === 'Male' ? 'father' : 'mother')
  }
  if (down === 1) {
    return (up > 3 ? stnd(up - 2) + ' ' : '') + 'Great-' + (gender === 'Male' ? 'Uncle' : 'Aunt')
  }
  return stnd(down - 1) + ' Cousin ' + ce(up - down) + ' Removed'
}

function strongText(strongs) {
  let texts = strongs.map(l => l[l.length-1])
  let ix = texts.indexOf('few children')
  if (ix !== -1 && texts.indexOf('no children') !== -1) {
    texts.splice(ix, 1)
  }
  return texts.map(text => <span className={
    'StrongLead_reason StrongLead_reason-' + text.replace(/ /g, '-')
  }>{text}</span>)
}

let StrongLead = React.createClass({
  propTypes: {
    display: PT.object,
    strongs: PT.array,
    flags: PT.object,
    // person: PT.object,
    pid: PT.string,
    // relationships: PT.object,
  },

  getInitialState() {
    return {note: this.props.note || ''}
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.note !== this.state.note) {
      this.setState({note: nextProps.note})
    }
  },

  _commitNote() {
    let news = this.state.note || ''
      , olds = this.props.note || ''
    if (news.trim() === olds.trim()) return
    this.props.onUpdate({note: this.state.note})
  },

  _onFinished() {
    this.props.onUpdate({isComplete: !this.props.finished, doLater: false})
  },

  _onLater() {
    this.props.onUpdate({doLater: !this.props.later, isComplete: false})
  },

  render: function () {
    var {display, pid} = this.props
    var age = new Date(display.deathDate).getFullYear() - new Date(display.birthDate).getFullYear()
    if (isNaN(age)) age = ''
    return <div className='StrongLead'>
      <div className='StrongLead_top'>
        <a href={arkUrl(pid)} target="_blank">View on FamilySearch</a>
        <span className='StrongLead_name'>{display.name}</span>
        <span className='StrongLead_lifespan'>{display.lifespan}</span>
        <span className='StrongLead_age'>{age}</span>
      </div>
      <div className='StrongLead_panes'>
        <div className='StrongLead_left'>
          <div className='StrongLead_rel'>{relationText(this.props.gen.up.length, this.props.gen.down.length, display.gender)}</div>
          {(display.birthDate || display.birthDate) ?
            <div className='StrongLead_life'>
              <strong>Birth: </strong>
              <span className='StrongLead_date'>
                {display.birthDate}
              </span>
              <div className='StrongLead_place'>{display.birthPlace}</div>
            </div> : null}
          {(display.deathDate || display.deathDate) ?
            <div className='StrongLead_life'>
              <strong>Death: </strong>
              <span className='StrongLead_date'>
                {display.deathDate}
              </span>
              <div className='StrongLead_place'>{display.deathPlace}</div>
            </div> : null}
          <div className='StrongLead_reasons'>
            {strongText(this.props.strongs)}
          </div>
        </div>
        <div className='StrongLead_right'>
          <textarea
            className='StrongLead_note'
            value={this.state.note}
            onChange={e => this.setState({note: e.target.value})}
            onBlur={this._commitNote}
            placeholder="Write a note to yourself"/>
          <div className='StrongLead_buttons'>
            {!this.props.finished && <button className='StrongLead_later' onClick={this._onLater}>
              {this.props.later ? 'Work on now' : 'Do later'}
            </button>}
            <button className='StrongLead_finished' onClick={this._onFinished}>
              {this.props.finished ? 'Work on more' : 'Mark Finished'}
            </button>
          </div>
        </div>
      </div>
    </div>
  }
})

export default StrongLead

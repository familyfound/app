
import React from 'react'
import {PENDING} from '../flux'
let {PropTypes: PT} = React

import NoteEditor from './note-editor'
import MorphComp from './morph-comp'
import MorphMixin from './morpher'

import renderText from '../shared/render-text'

export default React.createClass({
  propTypes: {
    onRemove: PT.func.isRequired,
    onUpdate: PT.func.isRequired,
    notes: PT.object.isRequired,
  },

  mixins: [MorphMixin()],

  getInitialState() {
    return {editing: null}
  },

  _stopEditing(e) {
    if (e) e.preventDefault()
    this.setState({editing: null})
  },

  _doneEditing(id, val, e) {
    if (e) e.preventDefault()
    this.setState({editing: null})
    this.props.onUpdate(id, val)
  },

  _startEditing(id, e) {
    if (e.target.nodeName === 'A') return
    if (e) e.preventDefault()
    this.setState({editing: id})
  },

  _remove(id, e) {
    if (e) e.preventDefault()
    this.setState({editing: null})
    this.props.onRemove(id)
  },

  render() {
    if (!this.props.notes || this.props.notes === PENDING) return <span>Loading</span>
    return <ul className='NoteList'>
      {!this.props.notes.size && <li>No notes for this page yet</li>}
      {mapIf(this.props.notes, note => note.get('id') === this.state.editing,
        note => <li key={note.get('id')} className='NoteList_note'>
          <MorphComp>
          <NoteEditor
            note={note.toJS()}
            onCancel={this._stopEditing}
            onRemove={this._remove.bind(null, note.get('id'))}
            onSave={this._doneEditing.bind(null, note.get('id'))}/>
          </MorphComp>
        </li>,
        note => <li onClick={this._startEditing.bind(null, note.get('id'))} key={note.get('id')} className='NoteList_note'>
          <MorphComp>
          <div className='NoteList_text' dangerouslySetInnerHTML={{__html: renderText(note.get('text'))}}/>
          <div className='NoteList_date'>
            {note.get('date') && note.get('date').toLocaleString()}
          </div>
          </MorphComp>
        </li>
      ).toJS()}
    </ul>
  }
})

function mapIf(vals, cond, first, second) {
  return vals.map(val => cond(val) ? first(val) : second(val))
}


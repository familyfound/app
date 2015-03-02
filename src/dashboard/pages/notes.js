
import React from 'react'
import FluxComponent from '../../flux/flux-component'
import {PENDING} from '../../flux'

export default React.createClass({
  render() {
    return <FluxComponent stateFromStores={{notes: 'value'}}>
      <NotesList/>
    </FluxComponent>
  }
})

function makeGoodTitle(title) {
  if (!title.trim()) return '[no page title]'
  return title.split('|')[0].trim() || '[no page title]'
}

let NotesList = React.createClass({
  render() {
    if (!this.props.notes || this.props.notes === PENDING) {
      return <div className='NotesList'>
        Loading...
      </div>
    }
    return <div className='NotesList'>
      {this.props.notes.map(note => <div className='NotesList_note'>
        <a title="Go to this page"
           href={note.get('url')}>
          {makeGoodTitle(note.get('pageTitle'))}
        </a>
        {note.get('text')}
        {note.get('date').toLocaleString()}
      </div>).toJS()}
    </div>
  }
})


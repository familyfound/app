
import React from 'react'
import FluxComponent from '../../flux/flux-component'
import {PENDING} from '../../flux'

export default React.createClass({
  render() {
    return <FluxComponent stateFromStores={{notes:true}}>
      <NotesList/>
    </FluxComponent>
  }
})

function makeGoodTitle(title) {
  if (!title || !title.trim()) return '[no page title]'
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
      {this.props.notes.map(note => <div key={note.get('id')} className='NotesList_note'>
        <span className='NotesList_date'>{note.get('date').toLocaleString()}</span>
        <a title="Go to this page"
           className='NotesList_link'
           target="_blank"
           href={note.get('url')}>
          {makeGoodTitle(note.get('pageTitle'))}
        </a>
        <span className='NotesList_text'>{note.get('text')}</span>
      </div>).toJS()}
    </div>
  }
})


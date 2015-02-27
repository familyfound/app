/**
 * The main floater research assistant thing.
 */

import React from 'react'
import FluxComponent from '../flux/flux-component'

import Closer from './closer'
import NotesList from './note-list'
import CreateNote from './create-note'

export default React.createClass({
  render() {
    return <Closer className='Assistant'>
      <div className='Assistant_head'>
        FamilyFound
        <a href={this.props.dashboardUrl} target="_blank">visit dashboard</a>
      </div>
      <FluxComponent actions={{onCreate: 'notes.create'}}>
        <CreateNote/>
      </FluxComponent>
      <FluxComponent stateFromStores={{
        notes: 'value',
      }} actions={{
        onRemove: 'notes.remove',
        onUpdate: 'notes.update',
      }}>
        <NotesList/>
      </FluxComponent>
    </Closer>
  }
})


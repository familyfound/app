
import React from 'react'
import NotesList from '../components/notes-list'
import FluxComponent from '../../flux/flux-component'

export default React.createClass({
  render() {
    return <div className='LogPage'>
      <FluxComponent stateFromStores={{notes:true}}>
        <NotesList/>
      </FluxComponent>
    </div>
  }
})


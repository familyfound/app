
import React from 'react'
let {PropTypes: PT} = React

import Opener from './opener'
import NoteEditor from './note-editor'

export default React.createClass({
  propTypes: {
    onCreate: PT.func.isRequired,
  },

  render() {
    return <Opener>
      <div opener={{onClick: 'open'}} className='CreateNote'>
        Click to create a note
      </div>
      <div className='CreateNote CreateNote-open'>
        <NoteEditor
          note={{text: ''}}
          opener={{
            onCancel: 'close',
            onSave: ['close', this.props.onCreate],
          }}/>
      </div>
    </Opener>
  }
})


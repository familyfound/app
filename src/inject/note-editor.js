
import React from 'react'
import Form from '../flux/form'

export default React.createClass({
  onSubmit(data) {
    data.pageTitle = document.title
    this.props.onSave(data)
  },
  render() {
    return <Form
        className='NoteEditor'
        onSubmit={this.onSubmit}
        onCancel={this.props.onCancel}
        submitOnCtrlEnter={true}
        cancelOnEscape={true}
        initialData={{
          text: this.props.note.text,
        }}>
      <textarea autoFocus={true} name='text'/>
      <button type="submit">Save</button>
      <button onClick={this.props.onCancel}>
        Cancel
      </button>
      {this.props.onRemove && <button onClick={this.props.onRemove}>
        Remove
      </button>}
    </Form>
  }
})


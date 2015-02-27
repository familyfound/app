
import Store from './store'

export default class NoteStore extends CollectionStore {
  constructor(actions, creators) {
    super(actions, creators, 'notes')
  }
}


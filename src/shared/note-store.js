
export default class NoteStore extends CollectionStore {
  constants(pageId) {
    super('notes:' + pageId)
  }
}


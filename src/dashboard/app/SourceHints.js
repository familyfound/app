
import React from 'react'

export default class SourceHints extends React.Component {
  render() {
    if (!this.props.hints.length) {
      return <span/>
    }
    return (
      <div>
        Source Hints
        <ul>
          {this.props.hints.map(hint => (
            <li style={styles.item}>
              <a target="_blank" href={makeLink(this.props.pid, hint)}>
                {hint.collectionTitle} - {hint.personName}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const makeLink = (pid, hint) => {
  const pal = hint.palRecordUrl.slice('https://familysearch.org'.length)
  return `https://familysearch.org/search/linker?pal=${pal}&id=${pid}&hinting=%2Ftree%2F%23view%3Dancestor%26person%3D${pid}&icid=ft-hinting`
}

const styles = {
}


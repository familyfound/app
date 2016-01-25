
import React from 'react'

export default class SourcesList extends React.Component {
  render() {
    if (this.props.loading) {
      return <div style={styles.container}>
        Loading sources list...
      </div>
    }
    if (this.props.error) {
      return <div style={styles.container}>
        Failed to get sources list
      </div>
    }
    if (this.props.sources.length === 0) {
      return <div style={styles.container}>
        No sources attached
      </div>
    }
    return (
      <div style={styles.container}>
        {this.props.sources.length} Sources
        <ul style={styles.list}>
          {this.props.sources.map(source => (
            <Source source={source} />
          ))}
        </ul>
      </div>
    );
  }
}

class Source extends React.Component {
  render() {
    const source = this.props.source
    let title = null
    if (source.citations.length) {
      const match = source.citations[0].value.match(/^"([^"]+)"/)
      if (match) {
        title = match[1].trim().replace(/,$/, '')
      }
    }
    if (!title) {
      if (source.titles.length) {
        title = source.titles[0].value
        if (title.length > 50) {
          title = title.slice(0, 50) + '...'
        }
      } else {
        title = 'No title'
      }
    }
    return (
      <li style={styles.item}>
        <a style={styles.link} href={source.about} target='_blank'>
          {title}
        </a>
        {new Date(source.attribution.modified).toDateString()}
      </li>
    )
  }
}

const styles = {
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  link: {
    marginRight: 10,
  }
}

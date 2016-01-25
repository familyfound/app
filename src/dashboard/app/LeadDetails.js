
import React from 'react'
import {getOrdinances, getSources, getDuplicates, promCache} from './api'
import SourcesList from './SourcesList'
import OrdinancesList from './OrdinancesList'
import SourceHints from './SourceHints'

const PENDING = {'PENDING': true}
const ERROR = {'ERROR': true}

const getOrdinancesC = promCache(getOrdinances)
const getSourcesC = promCache(getSources)
const getDuplicatesC = promCache(getDuplicates)

class LeadDetails extends React.Component {
  render() {
    return (
      <div style={styles.container}>
        <SourceHints
          pid={this.props.pid}
          hints={this.props.hints}
        />
        <SourcesList
          loading={this.props.sources === PENDING}
          error={this.props.sources === ERROR}
          sources={this.props.sources}
        />
        <OrdinancesList
          loading={this.props.ordinances === PENDING}
          error={this.props.ordinances === ERROR}
          value={this.props.ordinances}
        />
        <pre>
        {JSON.stringify(this.props.duplicates, null, 2)}
        </pre>
      </div>
    );
  }
}

const promstate = (getProms, Component) => class Wrapper extends React.Component {
  constructor(props) {
    super(props)
    const proms = getProms(props)
    this.state = {}
    for (let name in proms) {
      this.state[name] = PENDING
      proms[name].then(
        val => this.setState({[name]: val}),
        err => {
          console.error('Failed to get list', err)
          this.setState({[name]: ERROR})
        }
      )
    }
  }

  render() {
    return <Component {...this.props} {...this.state} />
  }
}

const API = 'https://familysearch.org'

export default promstate(({pid, token}) => ({
  sources: getSourcesC(pid, API, token),
  ordinances: getOrdinancesC(pid, API, token),
  duplicates: getDuplicatesC(pid, API, token),
}), LeadDetails)

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: '100%',
    marginLeft: 20,
    width: 600,
  },
};


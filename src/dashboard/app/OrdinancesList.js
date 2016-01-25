
import React from 'react'

export default class OrdinancesList extends React.Component {
  render() {
    if (this.props.error) {
      return <div>Error loading ordinances</div>
    }
    if (this.props.loading) {
      return <div>Loading ordinances...</div>
    }
    const value = this.props.value
    return (
      <div style={styles.container}>
        <Ordinance value={value.baptism} />
        <Ordinance value={value.confirmation} />
        <Ordinance value={value.initiatory} />
        <Ordinance value={value.endowment} />
        <MultiOrdinance value={value.sealingsToParents} />
        <MultiOrdinance value={value.sealingsToSpouses} />
      </div>
    );
  }
}

class Ordinance extends React.Component {
  render() {
    const status = this.props.value.status;
    const letter = this.props.value.type[0];
    if (!styles['ordinance' + status]) {
      console.warn('Unknown ordinance status', status, this.props.value);
    }
    return <div title={this.props.value.hoverText} style={{
      ...styles.ordinance,
      ...styles['ordinance' + status]
    }}>{letter}</div>
  }
}

class MultiOrdinance extends React.Component {
  render() {
    if (!this.props.value.length) {
      return <div style={styles.disabled}>??</div>
    }
    const status = this.props.value[0].status;
    const letter = this.props.value[0].type[0];
    return <div title={this.props.value[0].hoverText} style={{
      ...styles.ordinance,
      ...styles['ordinance' + status]
    }}>{letter}</div>
  }
}

const styles = {
  container: {
    display: 'flex',
  },
  ordinance: {
    backgroundColor: 'red',
    width: 20,
    height: 20,
    textAlign: 'center',
    padding: 4,
    boxSizing: 'border-box',
    border: '1px solid red',
  },
  ordinanceCompleted: {
    backgroundColor: 'gray',
    borderColor: 'gray',
  },
  ordinanceReady: {
    backgroundColor: 'green',
    borderColor: 'green',
  },
  ordinanceInProgressNotPrinted: {
    backgroundColor: 'yellow',
    borderColor: 'yellow',
  },
  ordinanceInProgressPrinted: {
    backgroundColor: 'orange',
    borderColor: 'orange',
  },
  ordinanceInProgressWaiting: {
    backgroundColor: 'blue',
    borderColor: 'blue',
  },
  ordinanceNotAvailable: {
    backgroundColor: 'white',
    borderColor: 'gray',
  },
};


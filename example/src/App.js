import React, { Component } from 'react'
import Logger from './Logger'
import Stash from 'react-stash'

export default class App extends Component {
  componentDidMount() {
    Stash.set({
      'Bob': {
        name: 'Bob',
        planet: 'Earth',
        years: 15
      },
      'Alice': {
        name: 'Alice',
        planet: 'Earth',
        years: 10
      },
      'Planet': 'Earth'
    })
  }

  render() {
    return (
      <React.Fragment>
        <h1>Alice &amp; Bob: citizens of the Solar system</h1>
        <div>
          <Stash>
            {
              (state = new Map()) => {
                // Implementing action logging
                console.log(state.get('@'), state)
                return null
              }
            }
          </Stash>
          {/* Listen to 'Alice' and/or 'Bob' changes: subscribe="Alice, Bob" or subscribe={['Alice', 'Bob']} */}
          <Stash subscribe={['Alice', 'Bob']}>
            {
              (alice, bob) =>
                <React.Fragment>
                  {alice ? <Person {...alice} /> : <div>No Alice!</div>}
                  <hr />
                  {bob ? <Person {...bob} /> : <div>No Bob!</div>}
                </React.Fragment>
            }
          </Stash>
          <hr />
          {/* Listen to 'Planet' changes */}
          <Stash subscribe="Planet">
            {
              (planet) =>
                !!planet && <PlanetSwitch planet={planet} />
            }
          </Stash>
        </div>
      </React.Fragment>
    )
  }
}

const Person = ({ name, planet, years }) => {
  const msg = `${name} has lived on ${planet} for ${years} years.`
  return (
    <div>
      <div>
        <div>{msg}</div><button onClick={handleAddYear(name)}>+1 year</button>
      </div>
    </div>
  )
}

const handleAddYear = (name) => (e) => {
  e.preventDefault()
  Stash.set(name, ({ years }) => {
    return {
      '@': 'Add year',
      [name]: {
        years: years + 1
      }
    }
  })
}

const PlanetSwitch = ({ planet }) => {
  const dest = planet === 'Earth' ? 'Mars' : 'Earth'
  const title = `Let's all move from ${planet} to ${dest}`
  return (
    <button onClick={handlePlanetSwitch(dest)}>{title}</button>
  )
}

const handlePlanetSwitch = (destination) => (e) => {
  e.preventDefault()
  Stash.set('Alice', 'Bob', 'Planet', (alice, bob, planet) => ({
    '@': 'Switch planet',
    'Alice': {
      planet: destination,
      years: 1,
    },
    'Bob': {
      planet: destination,
      years: 1,
    },
    'Planet': destination
  }))
}
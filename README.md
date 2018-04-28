# react-stash

> Non-ceremonial external state manager for React

[![NPM](https://img.shields.io/npm/v/react-stash.svg)](https://www.npmjs.com/package/react-stash) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-stash
```

## Usage

```jsx
import React, { Component } from 'react'
import Logger from './Logger'
import Stash from 'react-stash'

class Example extends Component {
    render() {
        return (
            <div className={pageStyle}>
                <h2>Who lives where?</h2>
                <Stash subscribe="PRODUCER">
                    {
                        (producer) => <Producer {...producer} />
                    }
                </Stash>
                <Stash subscribe="CONSUMER">
                    {
                        (consumer) => consumer ? <Consumer {...consumer} /> : <div>Nobody lives nowhere</div>
                    }
                </Stash>
            </div>
        )
    }
}

const Consumer = ({ name, planet }) => {
    return (
        <div>{name} lives on {planet}</div>
    )
}

const Producer = () => {
    return (
        <form onSubmit={handleProducerSubmit}>
            <label>Name:
                <input type="text" name="name" onChange={handleProducerChange} />
            </label>&nbsp;
            <label>Planet:
                <input type="text" name="planet" onChange={handleProducerChange} />
            </label>&nbsp;
            <input type="submit" value="Submit" />
        </form>
    )
}

const handleProducerChange = (event) => {
    switch (event.target.name) {
        case 'name':
            // set directly 'name' in the 'PRODUCER' state object
            Stash.set({
                'PRODUCER': {
                    name: event.target.value
                }
            })
            break
        case 'planet':
            // set directly 'name' in the 'PRODUCER' state object
            Stash.set({
                'PRODUCER': {
                    planet: event.target.value
                }
            })
            break
    }
}

const handleProducerSubmit = (event) => {
    Stash.set('PRODUCER', ({ name, planet }) => ({
        // Submitting to the 'CONSUMER' state, using existing data from the 'PRODUCER'
        'CONSUMER': {
            name: name,
            planet: planet
        }
    }))
    event.preventDefault()
}

const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    padding: 30
}

```

## License

MIT © [](https://github.com/)

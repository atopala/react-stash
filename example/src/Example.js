import React, { Component } from 'react'
import Logger from './Logger'
import Stash from 'react-stash'

const page = {
    display: 'flex',
    flexDirection: 'column',
    padding: 30
}

class Example extends Component {
    render() {
        return (
            <div className={page}>
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

export default Example
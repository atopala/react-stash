/**
 * @class Stash
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Provider from './provider'

const provider = new Provider()

const splitIntoWords = (string) => {
    if (!string) return []

    return string.split(/[ ,.]+/)
}

class Stash extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.onChangeState = this.onStateChanged.bind(this)
        const { subscribe } = this.props
        if (Array.isArray(subscribe)) {
            this.subscribes = subscribe.reduce((acc, item) => {
                acc = [...acc, ...(splitIntoWords(item))]
                return acc
            }, []) || []
        } else if (typeof subscribe === 'string') {
            this.subscribes = splitIntoWords(subscribe || '') || []
        } else {
            this.subscribes = []
        }
    }

    componentDidMount() {
        const subscribes = this.subscribes
        this.subscription = provider.subscribe(this.onChangeState)
    }

    componentWillUnmount() {
        this.subscription.unsubscribe()
    }

    onStateChanged(ids = new Set()) {
        if (this.subscribes.some(sub => ids.has(sub))) {
            this.setState({ changeTime: new Date(), ids: Array.from(ids.values()) })
        }
    }

    render() {
        let { children } = this.props
        let { ids } = this.state
        const state = (this.subscribes || ids || []).map(id => Stash.get(id))
        //console.log('Stash.render()', this.subscribes, state)

        if (typeof children === 'function') {
            //return Children.only(children())
            let content = children(...state)
            if (!content) {
                return null
                //throw new Error(`No children content for subscription: ${subscribe}. Children: ${children}`)
            }

            return content
        }

        return React.Children.map(children, child => {
            return React.cloneElement(child, child.props ? { ...child.props, ...state } : undefined)
        })
    }

    /**
     * Sets values in the application state
     */
    static set = (...args) => {
        provider.set(...args)
    }

    /**
     * Gets a value by id(key) from the application state
     */
    static get = (id) => provider.get(id)

    /**
     * Deletes a value by id(key) from the application state
     */
    static delete = (id) => provider.delete(id)
}

Stash.propTypes = {
    subscribe: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ])
}

export default Stash
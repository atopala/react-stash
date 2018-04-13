/**
 * @class Stash
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Provider from './provider'
import { stat } from 'fs';

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

        if (typeof subscribe === 'function') {
            // subscription defined by function
            this.checkSubscription = (ids = new Set()) => subscribe(ids)
        } else if (Array.isArray(subscribe)) {
            this.subscribes = subscribe.reduce((acc, item) => {
                acc = [...acc, ...(splitIntoWords(item))]
                return acc
            }, []) || []
            this.checkSubscription = (keys = new Set()) => this.subscribes.some(sub => keys.has(sub))
        } else if (typeof subscribe === 'string') {
            this.subscribes = splitIntoWords(subscribe || '') || []
            this.checkSubscription = (keys = new Set()) => this.subscribes.some(sub => keys.has(sub))
        } else {
            this.checkSubscription = (keys = new Set()) => true
        }
    }

    componentDidMount() {
        const subscribes = this.subscribes
        this.subscription = provider.subscribe(this.onChangeState)
    }

    componentWillUnmount() {
        this.subscription.unsubscribe()
    }

    onStateChanged(changeMap = new Map()) {
        const keys = new Set(changeMap.keys())
        if (this.checkSubscription(keys)) {
            this.setState({
                timestamp: new Date(),
                changeMap
            })
        }
    }

    render() {
        let { children } = this.props
        let { changeMap } = this.state
        const state = this.subscribes ?
            this.subscribes.map(id => Stash.get(id)) :
            changeMap

        //console.log('Stash.render()', this.subscribes, state)
        // ids.reduce((acc, id) => ({
        //     ...acc,
        //     [id]: Stash.get(id)
        // }), {})

        if (typeof children === 'function') {
            //return Children.only(children())
            let content = Array.isArray(state) ? children(...state) : children(state)
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
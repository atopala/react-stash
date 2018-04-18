/**
 * @class StateProvider
 * This is used internally by the State Manager React Component.
 * It manages an internal dictionary with state values
 */

import { Subject } from 'rxjs/Subject'

export default class StateProvider {
    constructor() {
        this.__state = new Map()
        this.__subject = new Subject()
    }

    /**
     * Returns the state value by it's key (id)
     */
    get = (id) => this.__state.get(id)

    /**
     * Sets the state values.
     * Usage: direct vs. callback
     * 
     * 1. setting state directly with objects, and their top-properties as state keys:
     * .set({
     *  "name": "Bob",          // state key is 'name'
     *  "friends": ["Alice"]    // state key is 'friends'
     * })
     * - state keys are: "name", "friends"
     * 
     * 2. setting set(...) via a callback, and accessing existing state values (similar to React's internal state):
     * - arguments: the state keys to be accessed as callback's arguments. callback must be the last argument
     * .set("name", "friends", (name, friends) => {
     *      // merging(overwriting) the existing state with new values for the keys: "name" and "friends"
     *      return {
     *          "name": name + "_updated",          // state key is 'name'
     *          "friends": [...friends, "Jackie"]   // state key is 'friends'
     *      }
     *  })
     */
    set = (...args) => {
        if (args.length === 0) {
            throw new Error('No state for updating.')
        }

        if (args.length === 1) {
            // state value
            return this.__set(args[0])
        }

        let state = args.slice(-1)[0]
        if (typeof state !== 'function') {
            throw new Error('When providing keys for State.set(), the last argument must be a callback function with the state values as parameters: State.set("a", "b", (a, b) => { ... return {"a": { ... }, "b": { ... }} })');
        }
        const inputs = args.slice(0, -1).map(id => this.get(id))
        state = state(...inputs)
        return this.__set(state)
    }

    __set = (value) => {
        const keys = Object.keys(value)
        const changeSet = new Map()
        keys.forEach(key => {
            changeSet.set(key, value[key])
            if (Array.isArray(value[key])) {
                this.__state.set(key, value[key])
            }
            else if (typeof value[key] === 'object') {
                this.__state.set(key, {
                    ...this.get(key),
                    ...value[key]
                })
            } else {
                this.__state.set(key, value[key])
            }
        })

        this.__subject.next(changeSet)
        return changeSet
    }

    /**
     * Deletes the state by key (id)
     */
    delete = (id) => {
        const res = this.__state.delete(id)
        this.__subject.next(new Map([[id, undefined]]))
        return res
    }

    subscribe = (onChange) => {
        return this.__subject.subscribe(onChange)
    }
}
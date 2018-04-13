import Stash from './stash'
import React from 'react'
import { mount } from "enzyme"
import checkPropTypes from 'check-prop-types'
import { wrap } from 'module';

describe('Stash Tests', () => {
  it('is truthy', () => {
    expect(Stash).toBeTruthy()
  })

  it('check invalid prop-types number', () => {
    let result = checkPropTypes(Stash.propTypes, { subscribe: 123 }, 'prop', Stash.subscribe);
    expect(result).toBe('Failed prop type: Invalid prop `subscribe` supplied to `<<anonymous>>`.')
  })

  it('check invalid prop-types object', () => {
    let result = checkPropTypes(Stash.propTypes, { subscribe: { value: 'a' } }, 'prop', Stash.subscribe);
    expect(result).toBe('Failed prop type: Invalid prop `subscribe` supplied to `<<anonymous>>`.')
  })

  it('check invalid prop-types array of numbers', () => {
    let result = checkPropTypes(Stash.propTypes, { subscribe: { value: [1, 2, 3] } }, 'prop', Stash.subscribe);
    expect(result).toBe('Failed prop type: Invalid prop `subscribe` supplied to `<<anonymous>>`.')
  })

  it('check valid prop-types array of strings', () => {
    let result = checkPropTypes(Stash.propTypes, { subscribe: { value: ['a', 'b', 'c'] } }, 'prop', Stash.subscribe);
    expect(result).toBe('Failed prop type: Invalid prop `subscribe` supplied to `<<anonymous>>`.')
  })

  it('expect subscribe as single string', () => {
    const wrapper = mount(
      <Stash subscribe='a'>
        <div />
      </Stash>
    ).instance()

    expect(wrapper.subscribes).toEqual(['a'])
  })

  it('expect subscribe as CSV string', () => {
    const wrapper = mount(
      <Stash subscribe='a, b, 123'>
        <div />
      </Stash>
    ).instance()

    expect(wrapper.subscribes).toEqual(['a', 'b', '123'])
  })

  it('expect render when updating Stash state', () => {
    const wrapper = mount(
      <Stash subscribe='person'>
        {
          ({ firstName, lastName } = {}) =>
            (firstName || lastName ?
              <div>
                <div id='firstName'>{firstName}</div>
                <div id='lastName'>{lastName}</div>
              </div> :
              <div />
            )
        }
      </Stash>
    )

    wrapper.update()
    expect(wrapper.find('#firstName').length).toEqual(0)
    expect(wrapper.find('#lastName').length).toEqual(0)

    Stash.set({
      'person': {
        firstName: 'John',
        lastName: 'Doe'
      }
    })

    wrapper.update()
    expect(wrapper.find('#firstName').text()).toEqual('John')
    expect(wrapper.find('#lastName').text()).toEqual('Doe')
  })

})

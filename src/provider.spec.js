import Provider from './provider'

describe('Provider Tests', () => {
    it('undefined by default', () => {
        const provider = new Provider()
        expect(provider.get('test')).toBeUndefined()
    })

    it('set, get, delete state objects', () => {
        const provider = new Provider()

        expect(provider.set({
            "Bob": {
                name: "Bob",
                planet: "Earth",
                year: 2018
            }
        })).toEqual(new Map([
            ['Bob', {
                name: "Bob",
                planet: "Earth",
                year: 2018
            }]
        ]))
        expect(provider.get('Bob')).toEqual({
            name: "Bob",
            planet: "Earth",
            year: 2018
        })
        expect(provider.delete('Bob')).toEqual(true)
        expect(provider.get('Bob')).toBeUndefined()
    })

    it('set, get, delete state callback', () => {
        const provider = new Provider()
        const bob = {
            name: "Bob",
            planet: "Earth",
            year: 2018
        }

        // set #1
        expect(provider.set('Bob', (_bob) => {
            expect(_bob).toBeUndefined()
            return {
                'Bob': bob
            }
        })).toEqual(new Map([
            ['Bob', {
                name: "Bob",
                planet: "Earth",
                year: 2018
            }]
        ]))
        expect(provider.get('Bob')).toEqual(bob)

        expect(provider.set('Bob', (_bob) => {
            expect(_bob).toEqual({
                name: "Bob",
                planet: "Earth",
                year: 2018
            })

            return {
                'Bob': {
                    ..._bob,
                    city: 'Munich' //adding extra member
                },
                'Alice': {
                    name: 'Alice',
                    friends: [_bob]
                }
            }
        })).toEqual(new Map([
            ['Bob', {
                name: "Bob",
                planet: "Earth",
                year: 2018,
                city: 'Munich'
            }],
            ['Alice', {
                name: 'Alice',
                friends: [{
                    name: "Bob",
                    planet: "Earth",
                    year: 2018
                }]
            }]
        ]))

        expect(provider.get('Alice')).toEqual({
            name: 'Alice',
            friends: [{
                name: "Bob",
                planet: "Earth",
                year: 2018
            }]
        })

        expect(provider.delete('Bob')).toEqual(true)
        expect(provider.get('Bob')).toBeUndefined()
    })

    it('subscribe, unsubscribe to changes', () => {
        let bob = {
            name: 'Bob',
            plane: 'Earth'
        }
        // const onChange = (ids) => {
        //     expect(ids).toBeInstanceOf(Set)
        //     expect(ids.has('Bob'))
        // }
        const onChange = jest.fn()
        const provider = new Provider()
        const subscription = provider.subscribe(onChange)
        provider.set({
            'Bob': bob
        })
        provider.set('Bob', (_bob) => ({
            'Alice': {
                name: 'Alice',
                friends: [_bob]
            },
            'Bob': {
            }
        }))
        expect(onChange).toHaveBeenCalledTimes(2)
        expect(onChange.mock.calls[0][0]).toEqual(new Map([
            ['Bob', {
                name: 'Bob',
                plane: 'Earth'
            }]
        ]))
        expect(onChange.mock.calls[1][0]).toEqual(new Map([
            ['Alice', {
                name: 'Alice',
                friends: [{
                    name: 'Bob',
                    plane: 'Earth'
                }]
            }],
            ['Bob', {}]
        ]))

        // unsubscribe
        subscription.unsubscribe()
        // unsubscribe
        provider.set({
            'Jane': {
                name: 'Name'
            }
        })
        expect(onChange).toHaveBeenCalledTimes(2)
    })

    it('set, get string value', () => {
        const provider = new Provider()
        expect(provider.set({
            'name': 'Alice'
        })).toEqual(new Map([
            ['name', 'Alice']
        ]))

        expect(provider.get('name')).toEqual('Alice')
    })
})
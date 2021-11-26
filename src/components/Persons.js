import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { FIND_PERSON } from '../queries'


const Persons = ({persons, show, setError}) => {
const [getPerson, result] = useLazyQuery(FIND_PERSON, {
    onError(error) {
        setError(error)
    }
})
const [person, setPerson] = useState(null)

const showPerson = (name) => {
    getPerson({ variables: { nameToSearch: name}})
}

useEffect(() => {
    if (result.data) {
        setPerson(result.data.findPerson)
    }
}, [result])

if (person) {
    return(
        <div>
            <h2>{person.name}</h2>
            <div>{person.address.street} {person.address.city}</div>
            <div>{person.phone}</div>
            <button onClick={() => setPerson(null)}>close</button>
        </div>
    )
}

if (!show) {
    return null
}

    return (
        <div>
            <h2>Persons</h2>
            {persons.map(p => 
                <div key={p.name}>
                    {p.name} {p.phone}
                    <button onClick={() => showPerson(p.name)}>
                        show address
                    </button>
                </div>
                    )}
        </div>
    )
}

export default Persons
import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_USER } from '../queries'


const RegisterForm = ({ setError, show}) => {
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')


const [ createUser ] = useMutation(CREATE_USER, {
    onError: (error) => {
        setError(error.graphQLErrors[0].message)
    }
})

if (!show) {
    return null
}

const submit = async (event) => {
    event.preventDefault()

    createUser({ variables: { username, password}})
}

    return (
        <div>
        <h2>Register</h2>
            <form onSubmit={submit}>
                <div>
                    username 
                    <input 
                    value={username}
                    onChange={({target})=> setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                    value={password}
                    onChange={({target})=> setPassword(target.value)}
                    />
                </div>
                <button type='submit'>login</button>
            </form>
        </div>
    )
}

export default RegisterForm

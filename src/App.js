import React, { useState } from 'react'
import { useQuery, useApolloClient, useSubscription } from '@apollo/client'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import { ALL_PERSONS, PERSON_ADDED } from './queries'
import Notify from './components/Notify'
import PhoneForm from './components/PhoneForm'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'


const App = () => {
  const [page, setPage] = useState('login')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)

  const result = useQuery(ALL_PERSONS)
  const client = useApolloClient()

  const updateCacheWith = (addedPerson) => {
    const includedIn = ( set, object) => 
    set.map(p => p.id).includes(object.id)
    const dataInStore = client.readQuery({ query: ALL_PERSONS })
    if (!includedIn(dataInStore.allPersons, addedPerson)) {
      client.writeQuery({
        query: ALL_PERSONS,
        data: { allPersons : dataInStore.allPersons.concat(addedPerson)}
      })
    }
  }


  useSubscription(PERSON_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedPerson = subscriptionData.data.personAdded
      notify(`${addedPerson.name} added`)
      updateCacheWith(addedPerson)
    }
  })

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  if (result.loading) {
    return <div>loading...</div>
  }


  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  
  return (
    <div>
      <div>
        <button onClick={() => setPage('persons')}>persons</button>
        <button onClick={() => setPage('register')}>register</button>
      {token === null ? (<button onClick={() => setPage('login')}>login</button>)
      : (<div> <button onClick={() => setPage('addPerson')}>add person</button>
      <button onClick={() => setPage('addPhone')}>add phone</button>
        <button onClick={logout}>logout</button>
        </div>)}
      </div>
      <div>
      <Notify errorMessage={errorMessage} />
      </div>
     <Persons 
     show={page === 'persons'}
     setError={notify}
     persons = {result.data?.allPersons} />
    
    <PersonForm 
    show={page === 'addPerson'}
    setError={notify} 
    updateCacheWith={updateCacheWith}
    />

    <PhoneForm 
    show={page === 'addPhone'}
    setError={notify}
    />

    <LoginForm
    show={page === 'login'}
      setToken={setToken}
      setError={notify}
      />

    <RegisterForm 
    show={page === 'register'}
      setError={notify}
      />
    </div>
  );
}

export default App;

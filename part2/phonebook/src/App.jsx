import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Notification from './components/Notification'


import axios from 'axios'


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  const hook = () => {
  console.log('effect')
  axios
    .get('http://localhost:3001/persons')
    .then(response => {
      console.log('promise fulfilled')
      setPersons(response.data)
    })
}

useEffect(() => {
  personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
}, [])
  console.log('render', persons.length, 'persons')

  const addName = (event) => {
    event.preventDefault()

    const nameExists = persons.find(person => person.name === newName)
    if (nameExists) {
      const confirmUpdate = window.confirm(`This name already exists. Do you want to update the number? ${newName}`)

      if (!confirmUpdate) {
        return
      }
      
      
      const person = persons.find(p => p.id === nameExists.id)
      const updatedPerson = { ...person, number: newNumber }

      personService
        .update(person.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
          setNewName('')
          setNewNumber('')
        })
      .catch (error => {
        setNotificationMessage(`Information of ${persons.find(p => p.id === nameExists.id)?.name} has already been removed from server`)
        setNotificationType('error')
        setPersons(persons.filter(p => p.id !== person.id))
        setTimeout(() => {
          setNotificationMessage(null)
          setNotificationType(null)
        }, 4000)
      })
      return
    } 
    

    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    }
    personService
          .create(nameObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setNewName('')
            setNewNumber('')
          })
          setNotificationMessage(`Added ${newName}`)
          setNotificationType('success')
          setTimeout(() => {
            setNotificationMessage(null)
            setNotificationType(null)
          }, 4000)
  }

  const removeName = id => {
    const url = `http://localhost:3001/persons/${id}`
    if (window.confirm(`Delete this person? ${persons.find(p => p.id === id)?.name}`)) {
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
      .catch (error => {
        setNotificationMessage(`Information of ${persons.find(p => p.id === id)?.name} has already been removed from server`)
        setNotificationType('error')
        setPersons(persons.filter(p => p.id !== person.id))
        setTimeout(() => {
          setNotificationMessage(null)
          setNotificationType(null)
        }, 4000)
      })
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
    
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const filteredPersons = persons.filter(
    person => person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} type={notificationType} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a new Number</h2>
      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        addName={addName}
      />
      <h2>Numbers</h2>
      <ul>
        <Persons persons={filteredPersons} removeName={removeName} />
      </ul>
    </div>
  )
}


export default App
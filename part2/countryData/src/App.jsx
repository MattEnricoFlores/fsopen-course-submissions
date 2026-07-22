import { useState, useEffect } from 'react'
import axios from 'axios'
import Conditions from './components/Conditions'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const apiKey = import.meta.env.VITE_API_KEY
  

  useEffect(() => {
    console.log('effect run', countries)

    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [])

  const handleChange = (event) => {
    setFilter(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  const countriesToShow = filter === '' ? countries : filteredCountries

  const showCountry = (countryName) => {
    setFilter(countryName)
  }



  return (
    <div>
      <h1>Countries</h1>
      Find Countries:
      <input value={filter} onChange={handleFilterChange} />
      <ul>
        <div>
          <Conditions countriesToShow={countriesToShow} showCountry={showCountry} apiKey={apiKey} />
        </div>
      </ul>
    </div>
  )





}

export default App

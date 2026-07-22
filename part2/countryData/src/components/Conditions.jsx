import { useEffect, useState } from "react"
import axios from 'axios'

const Conditions = ({ countriesToShow, showCountry, apiKey }) => {
    
    const country =
  countriesToShow.length === 1
    ? countriesToShow[0]
    : null

    const [weather, setWeather] = useState(null)

    let iconUrl = ''

    if (weather) {
         iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    }


    useEffect(() => {
        if (!country) {
            return
        }
        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=metric&appid=${apiKey}`)
            .then(response => {
        console.log('weather promise fulfilled')
        setWeather(response.data)
            })
    }, [country])


    if (countriesToShow.length > 10) {
        return (
            <div>
                Too many matches, specify another filter
            </div>
        )
    }

    if (countriesToShow.length <= 10 && countriesToShow.length > 1) {
        return (
            <div>
                {countriesToShow.map(country => (
                    <li key={country.cca3}>
                        {country.name.common}
                        <button onClick={() => showCountry(country.name.common)}>show</button>
                    </li>
                ))}
            </div>
        )
    }

    if (countriesToShow.length === 1) {


        return (
            <div>
                <h2>{country.name.common}</h2>
                <p>Capital: {country.capital}</p>
                <p>Area: {country.area}</p>
                <h3>Languages:</h3>
                <ul>
                    {Object.values(country.languages).map(language => (
                        <li key={language}>{language}</li>
                    ))}
                </ul>
                <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />

                <h2>Weather in {country.capital}</h2>
                
                {!weather ? (
                    <p>Loading weather...</p>
                ) : (
                
                
                <div>
                 <p>Temperature {weather.main.temp} Celsius</p>

                 <img src={iconUrl} alt={`The weather is ${weather.weather[0].description}`} />

                 <p>Wind {weather.wind.speed} m/s</p>
                </div>
                )}

            </div>
        )


    }

    return (
        <div>
            {countriesToShow.map(country => (
                <li key={country.cca3}>{country.name.common}</li>
            ))}
        </div>
    )
}

export default Conditions
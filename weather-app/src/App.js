import React, { useState } from 'react';
const api = {
  key: "03e5513e4e80850b12120552d229b374",
  base: "https://api.openweathermap.org/data/2.5/"
}

// Search by location for suggestions: https://openweathermap.org/current#cycle
// api.openweathermap.org/data/2.5/find?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}

// https://openweathermap.org/weather-conditions

function App() {

  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [coordinations, setCoordinations] = useState({});
  const [suggestions, setSuggestions] = useState({});

  const search = evt => {
    if (evt.key === "Enter") {
      evt.preventDefault();

      fetch(`${api.base}weather?q=${query}&units=metric&appid=${api.key}`)
      .then(res => res.json())
      .then(result => {
        setWeather(result);
        setCoordinations(result.coord);
      })
      .catch(console.error);

      fetch(`${api.base}find?lat=${coordinations.lat}&lon=${coordinations.lon}&units=metric&cnt=5&appid=${api.key}`)
      .then(sugRes => sugRes.json())
      .then(sugResult => {
        setSuggestions(sugResult.list);
        console.log('suggestions :>> ', suggestions);
      })
    }
  }
  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
   }
  return (
    <div className={
      (typeof weather.main != "undefined")
       ? ((weather.main.temp > 16)
        ? 'app warm' 
        : 'app')
      : 'app'}>
      <main>
        <div className="search-box">
          <input 
            type="text" 
            className="search-bar" 
            placeholder="search" 
            onChange={ e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        {( typeof weather.main !== "undefined") ? (
          <div>
            <div className="searched-city">
              <div className="location-box">
                <div className="location">
                  {weather.name}, {weather.sys.country}
                </div>
                <div className="date">{dateBuilder(new Date())}</div>
              </div>
              <div className="weather-box">
                <div className="temp">{Math.round(weather.main.temp)} °C</div>
                <div className="weather">{weather.weather[0].main}</div>
              </div>
            </div>
            <div className="suggested-cities">
              {suggestions && suggestions.map((suggestion, index) => (
                <div className="weather-box suggested-city" key={ index }>
                  <span>{suggestion.name}</span>
                  <div className="temp">{Math.round(suggestion.main.temp)} °C</div>
                  <div className="weather">{suggestion.weather[0].main}</div>
                </div>
              ))}
            </div>
          </div>
          
        ) : (query !== '') ? (
          <div>
            <p className="error-warning">We couldn't find any results for {query}. Here is the error code: <span>{weather.message}!</span></p>
          </div>
          ) : ''}
      </main>
    </div>
  );
}

export default App;

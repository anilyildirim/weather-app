import React, { useState, useEffect } from 'react';
import { dateBuilder } from './helpers';

const api = {
  key: "03e5513e4e80850b12120552d229b374",
  baseUrl: "https://api.openweathermap.org/data/2.5/", 
  backupKey: "9575b4b0fc43fb3d06fc82c23e4cd645", 
}

// Search by location for suggestions: https://openweathermap.org/current#cycle
// api.openweathermap.org/data/2.5/find?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}

// https://openweathermap.org/weather-conditions

function App() {

  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [forecasts, setForecasts] = useState({});
  const [searchOnce, setSearchOnce] = useState(false);

  function getData(arg) {
    fetch(`${api.baseUrl}weather?q=${arg}&units=metric&appid=${api.backupKey}`)
      .then(res => res.json())
      .then(result => {
        setWeather(result);
      })
      .catch(console.error);
  }

  function handleSubmit(q) {
    getData(q)
    setInterval(() => { 
      getData(q)
    }, 10000);

    return weather;
  }

  const search = e => {
    e.preventDefault();
    setSearchOnce(false);
    handleSubmit(query);
    console.log('forecasts :>> ', forecasts);
  }

  useEffect(() => {
    if (weather.main && query && !searchOnce) {
      fetch(`${api.baseUrl}forecast?q=${query}&units=metric&cnt=5&appid=${api.backupKey}`)
      .then(res => res.json())
      .then(result => {
        setForecasts(result.list);
      })
      .catch(console.error);

      setSearchOnce(true);
    }
  }, [weather.main, forecasts, query, searchOnce]);

  return (
    <main className={
      (typeof weather.main != "undefined")
       ? ((weather.main.temp > 16)
        ? 'app warm' 
        : (weather.main.temp <= 16)
        ? 'app cold'
        : 'app initial')
      : 'app initial'}>
      <div className="app__inner">
        <h1>Check Weather</h1>
        <p>Enter city name</p>
        <form 
          as="form"
          role="search"
          action="/"
          className="search-form"
          method="get"
          onSubmit={search}
        >
          <input 
            type="text" 
            className="search-bar" 
            placeholder="search" 
            onChange={ e => setQuery(e.target.value)}
            value={query}
            onKeyPress={(e) => (
              (e.key === 'Enter') ? search(e): '')}
          />
          <div className="button-wrapper">
            <button type="submit">submit</button>
            <button type="reset" onClick={(e) => setQuery(e.target.value)}>reset</button>
          </div>
        </form>
        {( typeof weather.main !== "undefined") ? (
          <div>
            <div className="searched-city">
              <div className="location-box">
                <p className="location">
                  {weather.name}, {weather.sys.country}
                </p>
                {/* TODO:Fix datetime attribute */}
                <time dateTime={dateBuilder(new Date())[0]} className="date">{dateBuilder(new Date())[1]}</time>
              </div>
              <div className="weather-box">
                <p className="temp">{Math.round(weather.main.temp)} °C</p>
                <p className="weather">{weather.weather[0].main}</p>
                <p className="real-feel">{`Reel feel: ${Math.round(weather.main.feels_like)} °C`}</p>
              </div>
            </div>
            <ul className="forecast-results-list">
              {forecasts.length && forecasts.map((forecast) => (
                <li className="weather-box forecast-result" key={ forecast.dt }>
                  <time>{forecast.dt_txt}</time>
                  <p className="temp">{Math.round(forecast.main.temp)} °C</p>
                  <p className="weather">{forecast.weather[0].main}</p>
                  <img src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`} alt="Logo" width="80" height="80"/>
                </li>
              ))}
            </ul>
          </div>
        ) : (query) ? (
          <div>
            <strong className="error-warning">We couldn't find any results for {query}. Here is the error code: <span>{weather.message}!</span></strong>
          </div>
          ) : ''}
      </div>
    </main>
  );
}

export default App;

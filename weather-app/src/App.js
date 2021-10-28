import React, { useState, useEffect, useRef } from 'react';
import { dateBuilder } from './helpers';

const api = {
  key: "5e357949343cf59407294ed2d34dd8ab",
  baseUrl: "https://api.openweathermap.org/data/2.5/", 
  backupKey: "9575b4b0fc43fb3d06fc82c23e4cd645", 
}

function App() {
  const [localStorageQuery, setLocalStorageQuery] = useState('');
  const [query, setQuery] = useState('');
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({});
  const [searchOnce, setSearchOnce] = useState(false); // It shows that a query has been sent

  const isMounted = useRef(false);

  function getData(q) {
    fetch(`${api.baseUrl}weather?q=${q}&units=metric&appid=${api.key}`)
      .then(res => res.json())
      .then(result => {
        setWeather(result);
      })
      .catch(console.error);
  }

  function search(e) {
    e.preventDefault();
    if (query !== '') {
      setSearchOnce(false);
    }
  }

  // Check if component is mounted. If it is mounted, make an API request and set weather conditions
  useEffect(() => {
    if (isMounted.current) {
      getData(query);
      setSearchOnce(true);
      setInput('');
    } else {
      isMounted.current = true;
    }

  }, [query]);
  
  // Check if there is a valid response from the API. If there is, keep sending the same query for every 10 seconds.
  useEffect(() => {
    if (weather.main && query) {
      const interval = setInterval(() => {
        fetch(`${api.baseUrl}weather?q=${query}&units=metric&appid=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
        })
        .catch(console.error);

        console.log('this works');
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [weather, query])
  
  // Handle local storage on page load. Display the last 'valid' API result on the screen.
  useEffect(() => {
    if(localStorage.getItem('lastQuery')) {
      setLocalStorageQuery(localStorage.getItem('lastQuery'));
      getData(localStorage.lastQuery);
    }
  }, []);

  // Handle local storage after a valid API request.
  useEffect(() => {
    if (weather.main) {
      setLocalStorageQuery(weather.name);
      localStorage.setItem('lastQuery', localStorageQuery);
    }
  }, [weather.main, weather.name, localStorageQuery]);
  
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
          onSubmit={(e) => {
              search(e);
              if(e.target[0].value !== '') {
                setQuery(e.target[0].value);
              }
            }
          }
        >
          <input 
            type="text" 
            className="search-bar" 
            name="lastQuery"
            placeholder="search" 
            onChange={ e => setInput(e.target.value)}
            value={input}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                search(e);
                if(e.target.value !== '') {
                  setQuery(e.target.value);
                }
              }
            }}
          />
          <div className="button-wrapper">
            <button type="submit">submit</button>
            <button type="reset" 
              onClick={(e) => {
                  setInput(e.target.value)
                  setSearchOnce(false);
                }
              }>reset</button>
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
                <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="Logo" width="80" height="80"/>
              </div>
            </div>
          </div>
        ) : (searchOnce) ? (
          <div>
            <strong className="error-warning">We couldn't find any results for {query}. Here is the error code: <span>{weather.message}!</span></strong>
          </div>
          ) : ''}
      </div>
    </main>
  );
}

export default App;

import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Result from './components/Result';
import Error from './components/Error';

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
        ? 'app app__warm' 
        : (weather.main.temp <= 16)
        ? 'app app__cold'
        : 'app app__initial')
      : 'app app__initial'}>
      <div className="app__inner">
        <Header titleText="Check Weather" continuousText="Enter city name" />
        <form 
          as="form"
          role="search"
          action="/"
          className="app__search-form"
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
            className="app__search-bar" 
            name="lastQuery"
            placeholder="type your city" 
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
          <div className="app__button-wrapper">
            <button className="button" type="submit">submit</button>
            <button className="button" type="reset" 
              onClick={(e) => {
                  setInput(e.target.value)
                  setSearchOnce(false);
                }
              }>reset</button>
          </div>
        </form>
        {( typeof weather.main !== "undefined") ? (
          <Result weatherResult={weather} />
        ) : (searchOnce) ? (
          <Error usedQuery={query} errorMessage={weather.message} />
          ) : ''}
      </div>
    </main>
  );
}

export default App;

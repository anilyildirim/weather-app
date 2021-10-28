import React from 'react';
import { dateBuilder } from '../helpers';

const Result = ({ weatherResult }) => {

  return (
    <section className="result">
      <div className="result__location-box">
        <address className="result__location">
          {weatherResult.name}, {weatherResult.sys.country}
        </address>
        <time dateTime={dateBuilder(new Date())[0]} className="result__date">{dateBuilder(new Date())[1]}</time>
      </div>
      <div className="result__weather-box">
        <p className="result__temperature">{Math.round(weatherResult.main.temp)} °C</p>
        <div className="result__weather-condition">
          <p className="result__weather">{weatherResult.weather[0].main}</p>
          <img src={`http://openweathermap.org/img/wn/${weatherResult.weather[0].icon}@2x.png`} alt="Logo" width="80" height="80"/>
        </div>
        <p className="result__real-feel">{`Reel feel: ${Math.round(weatherResult.main.feels_like)} °C`}</p>
        
      </div>
    </section>
  );
};

export default Result;
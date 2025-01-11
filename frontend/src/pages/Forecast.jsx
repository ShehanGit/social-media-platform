// Forecast.js
import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometerHalf, faWind, faTint, faCloud, faSun, faSnowflake, faUmbrella } from '@fortawesome/free-solid-svg-icons';
import './Forecast.css';

function Forecast() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const lat = sessionStorage.getItem('latitude');
    const lon = sessionStorage.getItem('longitude');

    if (lat && lon) {
      const fetchWeatherData = async () => {
        const apiKey = '1eceee44619179169ee5a912cc84231f';
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Weather data could not be fetched.');
          }
          const data = await response.json();
          setWeatherData(data);
        } catch (error) {
          console.error('Failed to fetch weather data:', error);
        }
      };

      fetchWeatherData();
    }
  }, []);

  const getIcon = (condition) => {
    switch (condition) {
      case 'Clear':
        return faSun;
      case 'Snow':
        return faSnowflake;
      case 'Rain':
        return faUmbrella;
      default:
        return faCloud;
    }
  };

  const calculateRainPercentage = (rainData) => {
    if (!rainData || Object.keys(rainData).length === 0) {
      return "0% chance of rain";
    }
    const rainVolume = rainData['3h'] || 0;
    const maxRainFor100Percent = 1;
    const percentage = (rainVolume / maxRainFor100Percent) * 100;
    return `${Math.min(100, Math.round(percentage))}% chance of rain`;
  };

  const groupDataByDate = (data) => {
    const groupedData = {};
    data.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!groupedData[date]) {
        groupedData[date] = item;
      }
    });
    return groupedData;
  };

  return (
    <div>
      <NavBar />
      <div className="Forecast-container">
        <h1 className="Forecast-title">Forecast</h1>
        <ul className="Forecast-list">
          {weatherData ? (
            Object.entries(groupDataByDate(weatherData.list)).map(([date, item], index) => (
              <li key={index} className="Forecast-list-item">
                <div className="date-time">
                  <p>{date}</p>
                </div>
                <div className="weather-condition">
                  <FontAwesomeIcon icon={getIcon(item.weather[0].main)} />
                  <p>{item.weather[0].main}</p>
                </div>
                <div className="temperature">
                  <FontAwesomeIcon icon={faThermometerHalf} />
                  <p>{item.main.temp.toFixed(2)}°C</p>
                </div>
                <div className="humidity">
                  <FontAwesomeIcon icon={faTint} />
                  <p>{item.main.humidity}%</p>
                </div>
                <div className="wind">
                  <FontAwesomeIcon icon={faWind} />
                  <p>{(item.wind.speed * 3.6).toFixed(2)} km/h</p>
                </div>
                <div className="cloudiness">
                  <FontAwesomeIcon icon={faCloud} />
                  <p>{item.clouds.all}%</p>
                </div>
                <div className="rain-chance">
                  <FontAwesomeIcon icon={faUmbrella} />
                  <p>{calculateRainPercentage(item.rain)}</p>
                </div>
              </li>
            ))
          ) : (
            <p>Loading weather data...</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Forecast;

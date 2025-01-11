// WeatherApp.js
import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import './WeatherApp.css';

function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);

  const fetchWeather = async (lat, lon) => {
    const apiKey = '1eceee44619179169ee5a912cc84231f';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    // Store latitude and longitude in Session Storage
    sessionStorage.setItem('latitude', lat);
    sessionStorage.setItem('longitude', lon);

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch weather data");
      }
      setWeather(data);
      setError(null);
    } catch (error) {
      setError(error.message);
      setWeather(null); 
      console.error("Error fetching weather:", error);
    }
  };

  const fetchWeatherByCity = async () => {
    const apiKey = '1eceee44619179169ee5a912cc84231f';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch weather data");
      }
      setWeather(data);
      setError(null);
    } catch (error) {
      setError(error.message);
      setWeather(null); 
      console.error("Error fetching weather:", error);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      fetchWeather(position.coords.latitude, position.coords.longitude);
    }, (err) => {
      setError('Error retrieving your location: ' + err.message);
      setWeather(null); 
    });
  };

  return (
    <div>
      <NavBar />
      <div className="weather-container">
        <div className="input-container1">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
          />
          <button className='button1' onClick={fetchWeatherByCity}>Search Weather</button>
          <button className='button1' onClick={handleGetLocation}>Get Current Location Weather</button>
        </div>
        {error && <p className="error">Error: {error}</p>}
        {weather && (
          <div className="weather-details">
            <h1>Weather in {weather.name}</h1>
            <div className="temperature">{weather.main.temp}°C</div>
            <div className="condition">{weather.weather[0].main}</div>
            <div className="info">
              <div>
                <p>Feels Like: {weather.main.feels_like}°C</p>
                <p>Humidity: {weather.main.humidity}%</p>
                <p>Wind Speed: {weather.wind.speed} m/s</p>
                <p>Wind Direction: {weather.wind.deg} degrees</p>
              </div>
              <div>
                <p>Pressure: {weather.main.pressure} hPa</p>
                <p>Visibility: {weather.visibility / 1000} km</p>
                <p>Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
                <p>Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherApp;

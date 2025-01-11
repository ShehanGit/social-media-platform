import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../css/CropDetails.css';
import { getToken } from '../Utiliti/auth'; // Import to fetch the JWT token

function CropDetails() {
  const { id } = useParams();
  const [crop, setCrop] = useState(null);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCropDetails();
  }, [id]);

  useEffect(() => {
    if (crop) {
      fetchWeatherAndForecast();
    }
  }, [crop]);

  const fetchCropDetails = async () => {
    const token = getToken(); // Get JWT token from localStorage
    try {
      const response = await fetch(`http://localhost:8080/crops/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch crop data');
      }
      const data = await response.json();
      setCrop(data);

      // Store latitude and longitude in sessionStorage
      sessionStorage.setItem('latitude', data.latitude);
      sessionStorage.setItem('longitude', data.longitude);
    } catch (error) {
      setError(error.message);
      setCrop(null);
      console.error('Error fetching crop details:', error);
    }
  };

  const fetchWeatherAndForecast = async () => {
    const lat = sessionStorage.getItem('latitude');
    const lon = sessionStorage.getItem('longitude');
    if (!lat || !lon) {
      setError('Latitude and Longitude not available for this crop.');
      return;
    }

    try {
      const apiKey = '1eceee44619179169ee5a912cc84231f';
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      // Fetch weather data
      const weatherResponse = await fetch(weatherUrl);
      if (!weatherResponse.ok) {
        const weatherError = await weatherResponse.json();
        throw new Error(weatherError.message || 'Failed to fetch weather data');
      }
      const weatherData = await weatherResponse.json();
      setWeather(weatherData);

      // Fetch forecast data
      const forecastResponse = await fetch(forecastUrl);
      if (!forecastResponse.ok) {
        const forecastError = await forecastResponse.json();
        throw new Error(forecastError.message || 'Failed to fetch forecast data');
      }
      const forecastData = await forecastResponse.json();
      setForecast(forecastData);

      generateRecommendations(weatherData, forecastData);
    } catch (error) {
      setError(error.message);
      setWeather(null);
      setForecast(null);
      console.error('Error fetching weather or forecast:', error);
    }
  };

  const generateRecommendations = (weatherData, forecastData) => {
    if (!crop) return;
    let recommendations = '';

    if (weatherData.main?.temp < crop.optimalTemperatureMin) {
      recommendations += 'The current temperature is below optimal. Consider using protective measures to maintain warmth for the crop.\n';
    } else if (weatherData.main?.temp > crop.optimalTemperatureMax) {
      recommendations += 'The current temperature is above optimal. Consider providing shade or increasing irrigation to cool the crop.\n';
    } else {
      recommendations += 'The current temperature is within the optimal range for the crop.\n';
    }

    if (forecastData && forecastData.list[0]?.rain && forecastData.list[0].rain['3h'] > 1) {
      recommendations += 'The rainfall is expected to be more than 1mm. Consider reducing the irrigation amount to prevent overwatering.\n';
    } else {
      recommendations += 'The expected rainfall is less than 1mm. Consider supplying additional irrigation to the crops if needed.\n';
    }

    setRecommendation(recommendations);
  };

  return (
    <div>
      <NavBar />
      <div className="crop-details-container">
        {error && <p className="error">{error}</p>}
        <div className="details-section">
          {crop && (
            <>
              <div className="crop-image-container">
                <img src={crop.imageUrl} alt={crop.cropName} className="crop-detail-image" />
              </div>
              <div className="crop-info">
                <h1>{crop.cropName}</h1>
                <p className="info">Type: <span>{crop.cropType}</span></p>
                <p className="info">Optimal Temperature: <span>{crop.optimalTemperatureMin}°C - {crop.optimalTemperatureMax}°C</span></p>
                <p className="info">Optimal Humidity: <span>{crop.optimalHumidity}%</span></p>
                <p className="info">Soil Type: <span>{crop.soilType}</span></p>
                <p className="info">Planting Season: <span>{crop.plantingSeason}</span></p>
                <p className="info">Harvest Time: <span>{crop.harvestTime}</span></p>
                <p className="info">pH Requirement: <span>{crop.phRequirementMin} - {crop.phRequirementMax}</span></p>
                <p className="info">Nutrient Requirements: <span>{crop.nutrientRequirements}</span></p>
                <p className="info">Yield per Hectare: <span>{crop.yieldPerHectare} kg</span></p>
                <p className="info">Disease Resistance: <span>{crop.diseaseResistance}</span></p>
                <p className="info">Pest Sensitivity: <span>{crop.pestSensitivity}</span></p>
                <p className="info">Location: <span>Latitude {crop.latitude}, Longitude {crop.longitude}</span></p>
              </div>
            </>
          )}
        </div>

        <div className="information-section">
          {weather && (
            <div className="forecast-details card">
              <h2>Current Weather</h2>
              <p>Temperature: {weather.main?.temp}°C</p>
              <p>Condition: {weather.weather?.[0]?.main}</p>
              <p>Humidity: {weather.main?.humidity}%</p>
              <p>Wind Speed: {weather.wind?.speed} m/s</p>
            </div>
          )}
          {forecast && (
            <div className="forecast-details card">
              <h2>Forecast</h2>
              <p>Temperature: {forecast.list[0]?.main.temp}°C</p>
              <p>Humidity: {forecast.list[0]?.main.humidity}%</p>
              <p>Wind Speed: {forecast.list[0]?.wind.speed} m/s</p>
              <p>Rainfall: {forecast.list[0]?.rain ? forecast.list[0].rain['3h'] : 0} mm</p>
            </div>
          )}
          {recommendation && (
            <div className="recommendation card">
              <h3>Recommendation</h3>
              <p>{recommendation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CropDetails;

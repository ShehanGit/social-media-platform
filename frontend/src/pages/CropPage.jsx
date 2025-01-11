import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../css/CropPage.css';
import { getToken } from '../Utiliti/auth';

function CropApp() {
  const [crops, setCrops] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCrops = async () => {
    const url = 'http://localhost:8080/crops';
    try {
      const token = getToken(); 
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch crop data');
      }

      const data = await response.json(); // Parse the JSON response
      setCrops(data);
      setError(null);
    } catch (error) {
      setError(error.message);
      setCrops([]);
      console.error('Error fetching crops:', error);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/crop/${id}`);
  };

  return (
    <div>
      <NavBar />
      <div className="crop-container">
        <h1>Crop List</h1>
        {error && <p className="error">Error: {error}</p>}
        <div className="crop-list">
          {crops.length === 0 && !error && <p>No crops available.</p>}
          {crops.map((crop) => (
            <div
              key={crop.id || crop.cropId}
              className="crop-card"
              onClick={() => handleCardClick(crop.id || crop.cropId)}
            >
              {crop.imageUrl && (
                <img
                  src={crop.imageUrl}
                  alt={`${crop.cropName}`}
                  className="crop-image"
                />
              )}
              <h2 className="crop-name">{crop.cropName}</h2>
              <p>Type: {crop.cropType}</p>
              <p>
                Optimal Temperature: {crop.optimalTemperatureMin}°C -{' '}
                {crop.optimalTemperatureMax}°C
              </p>
              <p>Soil Type: {crop.soilType}</p>
              <p>Planting Season: {crop.plantingSeason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CropApp;

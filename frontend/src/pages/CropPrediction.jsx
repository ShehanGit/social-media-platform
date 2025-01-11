import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import '../css/CropPrediction.css';
import axios from 'axios';
import { getToken } from '../Utiliti/auth'; // Import for JWT token retrieval

function CropPrediction() {
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    const token = getToken(); // Get JWT token for authentication

    try {
      const response = await axios.post(
        'http://localhost:8080/predict',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
        }
      );
      setResult(response.data['Recommended Crop']); // Assuming backend sends the crop as 'Recommended Crop'
    } catch (error) {
      console.error('Error fetching prediction:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to get crop prediction. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="dashboard-container">
        <div className="sidebar">
          <h2>Crop Prediction</h2>
          <form onSubmit={handleSubmit} className="crop-form">
            <label>N (Nitrogen):</label>
            <input
              type="number"
              name="N"
              value={formData.N}
              onChange={handleInputChange}
              required
            />

            <label>P (Phosphorus):</label>
            <input
              type="number"
              name="P"
              value={formData.P}
              onChange={handleInputChange}
              required
            />

            <label>K (Potassium):</label>
            <input
              type="number"
              name="K"
              value={formData.K}
              onChange={handleInputChange}
              required
            />

            <label>Temperature (°C):</label>
            <input
              type="number"
              name="temperature"
              value={formData.temperature}
              onChange={handleInputChange}
              required
            />

            <label>Humidity (%):</label>
            <input
              type="number"
              name="humidity"
              value={formData.humidity}
              onChange={handleInputChange}
              required
            />

            <label>pH:</label>
            <input
              type="number"
              name="ph"
              value={formData.ph}
              onChange={handleInputChange}
              required
            />

            <label>Rainfall (mm):</label>
            <input
              type="number"
              name="rainfall"
              value={formData.rainfall}
              onChange={handleInputChange}
              required
            />

            <button type="submit">Get Crop Prediction</button>
          </form>
        </div>

        <div className="result-display">
          {result ? (
            <div className="result-card">
              <h3>Your Recommended Crop:</h3>
              <p>{result}</p>
            </div>
          ) : (
            <div className="placeholder">
              <p>
                Enter the data on the left and click "Get Crop Prediction" to see
                the recommended crop here.
              </p>
            </div>
          )}
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default CropPrediction;

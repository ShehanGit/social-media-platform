import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../Utiliti/api";

const RegisterPage = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ firstname, lastname, email, password });
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      alert("Registration failed: " + error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-80" onSubmit={handleRegister}>
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input
          type="text"
          placeholder="First Name"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;

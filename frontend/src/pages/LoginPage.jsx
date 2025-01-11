import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import { loginUser } from "../Utiliti/api";
import { setToken } from "../Utiliti/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password });
      setToken(data.token);
      navigate("/");
      // navigate("/protected");
    } catch (error) {
      alert("Login failed: " + error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-80" onSubmit={handleLogin}>
        <h2 className="text-xl font-bold mb-4">Login</h2>
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
        <button className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
        {/* Add link to registration page */}
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;

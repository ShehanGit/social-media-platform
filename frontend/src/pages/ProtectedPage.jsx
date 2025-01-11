import React from "react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../Utiliti/auth";

const ProtectedPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Protected Page!</h1>
      <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded">
        Logout
      </button>
    </div>
  );
};

export default ProtectedPage;

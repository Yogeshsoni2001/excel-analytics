import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { 
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
       localStorage.setItem("userName", res.data.user.name); 
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-300 via-yellow-100 to-blue-300 relative">
      <a href="/" title="Go Back" className="absolute top-4 left-6 cursor-pointer duration-200 hover:scale-125 active:scale-100">
  <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="50px" viewBox="0 0 24 24" className="stroke-blue-500">
    <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" d="M11 6L5 12M5 12L11 18M5 12H19" />
  </svg>
</a>
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md mt-6">
        
        <div className="flex justify-center mb-5">
        <img src="/logo.png" alt="grapiq Logo" className="h-9 w-auto" />
        </div>

        <h3 className="text-center text-xl font-bold">Welcome Back!</h3>
        <p className="text-center text-sm text-gray-500 mb-6">We missed you! Please enter your details.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Sign in</button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account? <a href="/register" className="text-blue-600 font-medium">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

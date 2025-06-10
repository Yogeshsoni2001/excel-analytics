import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      login(res.data.user, res.data.token);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-300 via-yellow-100 to-blue-300 relative">


      <a href="/" title="Go Back" className="absolute top-4 left-6 cursor-pointer duration-200 hover:scale-125 active:scale-100">
  <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="50px" viewBox="0 0 24 24" className="stroke-blue-500">
    <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" d="M11 6L5 12M5 12L11 18M5 12H19" />
  </svg>
</a>

        


      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-5">
        <img src="/logo.png" alt="grapiq Logo" className="h-9 w-auto" />
        </div>
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-1">Sign up</h2>
        <p className="text-center text-gray-500 mb-6">Join the community today!</p>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md mb-3" required />
          <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-md mb-3" required />
          <input type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded-md mb-3" required />
          <input type="password" name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 border rounded-md mb-3" required />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button className="w-full p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:opacity-90">Sign up</button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Already a member? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
 
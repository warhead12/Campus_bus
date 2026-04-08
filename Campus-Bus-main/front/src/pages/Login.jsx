import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { getRequestErrorMessage } from '../utils/requestErrorMessage';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const emailRegex = /^[^\s@]+@iiita\.ac\.in$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    let error = '';
    if (name === 'email' && !emailRegex.test(value)) {
      error = 'Invalid email format';
    } else if (name === 'password' && !passwordRegex.test(value)) {
      error = 'Password must be at least 8 characters long and contain both letters and numbers';
    }
    setErrors({
      ...errors,
      [name]: error
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.email || errors.password) {
      alert('Please fix the errors in the form');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/v1/admins/login', formData, {
        withCredentials: true
      });
      const payload = response.data?.data;
      const accessToken = payload?.accessToken;
      const refreshToken = payload?.refreshToken;
      if (!accessToken || !refreshToken) {
        alert(
          response.data?.message ||
            'Login succeeded but the server response was missing tokens.'
        );
        return;
      }

      login(accessToken, refreshToken);
      navigate('/home-admin');
    } catch (error) {
      alert(getRequestErrorMessage(error));
    }
  };

  const handleReset = () => {
    setFormData({
      email: '',
      password: ''
    });
    setErrors({
      email: '',
      password: ''
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg focus:outline-none hover:bg-gray-400"
              >
                Reset
              </button>
              <button
                type="submit"
                className="bg-yellow-500 text-black py-2 px-4 rounded-lg hover:bg-yellow-700 focus:outline-none focus:bg-yellow-700"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

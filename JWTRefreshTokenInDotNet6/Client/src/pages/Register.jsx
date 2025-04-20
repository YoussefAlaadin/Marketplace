import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
const Register = () => {
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Username: '',
    Email: '',
    Password: '',
    Role: 'Customer',
  })
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5029/api/Auth/register', formData)
      if (res.data.isAuthenticated) {
        console.log(res.data.isAuthenticated)
      }

      navigate('/login');
      alert(res.data.message || 'Registration successful')
    } catch (err) {
      // ✅ اطبع رسالة الخطأ من السيرفر لو موجودة
      if (err.response && err.response.data) {
        console.error(err.response.data)
        alert( err.response.data)
      } else {
        // لو مفيش تفاصيل في الخطأ
        alert('Registration failed due to network or server error')
      }
    }
  }
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <input
          type="text"
          name="FirstName"
          placeholder="First Name"
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        />

        <input
          type="text"
          name="LastName"
          placeholder="Last Name"
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        />

        <input
          type="text"
          name="Username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        />

        <input
          type="email"
          name="Email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        />

        <input
          type="password"
          name="Password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        />

        <select
          name="Role"
          onChange={handleChange}
          className="w-full p-2 mb-6 border rounded"
        >
          <option value="Customer">Customer</option>
          <option value="Vendor">Vendor</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Register
        </button>
      </form>
    </div>
  )
}

export default Register

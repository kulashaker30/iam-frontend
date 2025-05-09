import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/authSlice';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', firstname: '', lastname: '', email: '' });
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form));
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full border p-2" name="firstname" placeholder="First Name" onChange={handleChange} />
        <input className="w-full border p-2" name="lastname" placeholder="Last Name" onChange={handleChange} />
        <input className="w-full border p-2" name="email" placeholder="Email" onChange={handleChange} />
        <input className="w-full border p-2" name="username" placeholder="Username" onChange={handleChange} />
        <input className="w-full border p-2" type="password" name="password" placeholder="Password" onChange={handleChange} />
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

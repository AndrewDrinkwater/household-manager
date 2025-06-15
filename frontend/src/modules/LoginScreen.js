import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../api';

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, { username, password });
      setLoading(false);
      localStorage.setItem('token', res.data.token); // store JWT token
      onLoginSuccess(res.data.user);
    } catch (err) {
      setLoading(false);
      if (err.response?.status === 401) {
        setError('Invalid username or password');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      padding: 20,
    }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 320, width: '100%' }}>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginBottom: 12 }}
            autoFocus
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginBottom: 12 }}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: 10 }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
      </form>
    </div>
  );
}

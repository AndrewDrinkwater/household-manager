import React, { useState, useEffect } from 'react';

export default function UserForm({ existing, onSaved, onCancel }) {
  const [user, setUser] = useState(
    existing || { username: '', email: '', password: '', role: 'user' }
  );

  useEffect(() => {
    if (existing) {
      setUser({ 
        username: existing.username, 
        email: existing.email, 
        password: '',         // clear password on edit
        role: existing.role 
      });
    }
  }, [existing]);

  const handleChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSaved(user);
    setUser({ username: '', email: '', password: '', role: 'user' });
  };

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem'
  };
  const labelStyle = { marginBottom: '0.25rem', fontWeight: 'bold' };
  const inputStyle = { padding: '0.5rem', fontSize: '1rem' };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
      <div style={fieldStyle}>
        <label style={labelStyle}>Username</label>
        <input
          style={inputStyle}
          name="username"
          value={user.username}
          onChange={handleChange}
          required
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Email</label>
        <input
          style={inputStyle}
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>
          {existing ? 'New Password (optional)' : 'Password'}
        </label>
        <input
          style={inputStyle}
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          required={!existing}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Role</label>
        <select
          style={inputStyle}
          name="role"
          value={user.role}
          onChange={handleChange}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <button type="button" onClick={onCancel} style={{ padding: '0.5rem 1rem' }}>
          Cancel
        </button>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          {existing ? 'Update' : 'Add'} User
        </button>
      </div>
    </form>
  );
}

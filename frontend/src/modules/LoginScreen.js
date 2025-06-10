import React from 'react';

export default function LoginScreen({ onLogin }) {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <h2>Welcome to Household Manager</h2>
      <button
        onClick={onLogin}
        style={{ padding: '1rem 2rem', fontSize: '1.25rem', cursor: 'pointer' }}
      >
        Login
      </button>
    </div>
  );
}

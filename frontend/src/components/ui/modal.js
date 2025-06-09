import React from 'react';

export default function Modal({ children, onClose }) {
  return (
    <div style={backdrop}>
      <div style={dialog}>
        <button onClick={onClose} style={closeBtn}>×</button>
        {children}
      </div>
    </div>
  );
}

const backdrop = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1000
};

const dialog = {
  background: '#fff', borderRadius: '8px', padding: '1rem',
  minWidth: '320px', maxWidth: '90%', position: 'relative'
};

const closeBtn = {
  position: 'absolute', top: '8px', right: '8px',
  background: 'transparent', border: 'none', fontSize: '1.2rem',
  cursor: 'pointer'
};

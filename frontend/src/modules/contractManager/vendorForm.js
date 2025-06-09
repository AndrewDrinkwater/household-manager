import React, { useState, useEffect } from 'react';

export default function VendorForm({ existing, onSaved, onCancel }) {
  const [vendor, setVendor] = useState(
    existing || { name: '', contact_info: '', notes: '' }
  );

  useEffect(() => {
    if (existing) setVendor(existing);
  }, [existing]);

  const handleChange = e => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSaved(vendor);
    setVendor({ name: '', contact_info: '', notes: '' });
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
        <label style={labelStyle}>Name</label>
        <input
          style={inputStyle}
          name="name"
          value={vendor.name}
          onChange={handleChange}
          required
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Contact Info</label>
        <input
          style={inputStyle}
          name="contact_info"
          value={vendor.contact_info}
          onChange={handleChange}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Notes</label>
        <textarea
          style={{ ...inputStyle, minHeight: '60px' }}
          name="notes"
          value={vendor.notes}
          onChange={handleChange}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <button type="button" onClick={onCancel} style={{ padding: '0.5rem 1rem' }}>
          Cancel
        </button>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          {existing ? 'Update' : 'Add'} Vendor
        </button>
      </div>
    </form>
  );
}

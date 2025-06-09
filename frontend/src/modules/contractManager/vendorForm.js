import React, { useState, useEffect } from 'react';

function VendorForm({ existing, onSaved, onCancel }) {
  const [form, setForm] = useState(
    existing || { name: '', contact_info: '', notes: '' }
  );

  useEffect(() => {
    if (existing) setForm(existing);
  }, [existing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaved(form);
    setForm({ name: '', contact_info: '', notes: '' }); // reset after save
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '1rem 0' }}>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Vendor name"
        required
      />
      <input
        name="contact_info"
        value={form.contact_info}
        onChange={handleChange}
        placeholder="Contact info"
      />
      <input
        name="notes"
        value={form.notes}
        onChange={handleChange}
        placeholder="Notes"
      />
      <button type="submit">{existing ? 'Update' : 'Add'} Vendor</button>
      {onCancel && (
        <button type="button" onClick={onCancel} style={{ marginLeft: '0.5rem' }}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default VendorForm;

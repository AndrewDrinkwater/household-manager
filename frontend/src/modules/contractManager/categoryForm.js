import React, { useState, useEffect } from 'react';
import { createCategory, updateCategory } from '../../api';

export default function CategoryForm({ existing, onSaved, onCancel }) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (existing) setName(existing.name);
  }, [existing]);

  const handleSubmit = e => {
    e.preventDefault();
    const action = existing
      ? updateCategory(existing.id, { name })
      : createCategory({ name });

    action
      .then(onSaved)
      .catch(err => alert('Error: ' + err.message));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label>Name</label>
        <input
          required
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <button
          type="button"
          className="btn btn-warning"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {existing ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}

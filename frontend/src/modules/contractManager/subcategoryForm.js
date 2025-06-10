// src/modules/contractManager/subcategoryForm.js
import React, { useState, useEffect } from 'react';
import { createSubcategory, updateSubcategory } from '../../api';

export default function SubcategoryForm({ existing, categories = [], onSaved, onCancel }) {
  const [name, setName] = useState('');
  const [CategoryId, setCategoryId] = useState('');

  useEffect(() => {
    if (existing) {
      setName(existing.name || '');
      setCategoryId(existing.CategoryId || existing.categoryId || '');
    }
  }, [existing]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!CategoryId) {
      alert('Please select a category');
      return;
    }

    const data = { name, CategoryId: Number(CategoryId) };

    const action = existing
      ? updateSubcategory(existing.id, data)
      : createSubcategory(data);

    action
      .then(onSaved)
      .catch(err => alert('Error saving subcategory: ' + err.message));
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

      <div className="mb-2">
        <label>Category</label>
        <select
          required
          value={CategoryId}
          onChange={e => setCategoryId(e.target.value)}
        >
          <option value="">— select —</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
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

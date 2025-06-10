// src/modules/contractManager/contractForm.js
import React, { useEffect, useState } from 'react';
import {
  createService,
  updateService,
  getCategories,
  getSubcategories,
  getVendors,
  getFrequencies
} from '../../api';

export default function ContractForm({ existing, onSaved, onCancel }) {
  const [service, setService] = useState({
    name: '',
    contract_number: '',
    account_url: '',
    username: '',
    cost: '',
    start_date: '',
    next_due_date: '',
    notes: '',
    VendorId: '',
    CategoryId: '',
    SubcategoryId: '',
    FrequencyId: ''
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [frequencies, setFrequencies] = useState([]);

  useEffect(() => {
    getCategories().then(r => setCategories(r.data));
    getSubcategories().then(r => setSubcategories(r.data));
    getVendors().then(r => setVendors(r.data));
    getFrequencies().then(r => setFrequencies(r.data));

    if (existing) {
      setService({
        ...existing,
        VendorId: existing.VendorId || existing.vendorId,
        CategoryId: existing.CategoryId || (existing.Subcategory?.CategoryId ?? ''),
        SubcategoryId: existing.SubcategoryId || existing.subcategoryId,
        FrequencyId: existing.FrequencyId || existing.frequencyId
      });
    }
  }, [existing]);

  useEffect(() => {
    if (service.CategoryId) {
      setFilteredSubcategories(
        subcategories.filter(sc => sc.CategoryId === Number(service.CategoryId))
      );
    } else {
      setFilteredSubcategories([]);
    }
  }, [service.CategoryId, subcategories]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'CategoryId') {
      setService(prev => ({
        ...prev,
        CategoryId: value,
        SubcategoryId: '', // reset subcategory when category changes
      }));
    } else {
      setService(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    const payload = {
      ...service,
      cost: Number(service.cost),
      VendorId: Number(service.VendorId),
      SubcategoryId: Number(service.SubcategoryId),
      FrequencyId: Number(service.FrequencyId)
    };

    const action = existing
      ? updateService(existing.id, payload)
      : createService(payload);

    action
      .then(onSaved)
      .catch(err => alert('Error saving service: ' + err.message));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
        }}
      >
        <div>
          <label>Category</label>
          <select
            name="CategoryId"
            value={service.CategoryId}
            onChange={handleChange}
            required
          >
            <option value="">— select —</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Subcategory</label>
          <select
            name="SubcategoryId"
            value={service.SubcategoryId}
            onChange={handleChange}
            required
            disabled={!service.CategoryId}
          >
            <option value="">— select —</option>
            {filteredSubcategories.map(sc => (
              <option key={sc.id} value={sc.id}>
                {sc.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Vendor</label>
          <select
            name="VendorId"
            value={service.VendorId}
            onChange={handleChange}
            required
          >
            <option value="">— select —</option>
            {vendors.map(v => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Frequency</label>
          <select
            name="FrequencyId"
            value={service.FrequencyId}
            onChange={handleChange}
          >
            <option value="">— select —</option>
            {frequencies.map(f => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Service Name</label>
          <input
            name="name"
            value={service.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Contract Number</label>
          <input
            name="contract_number"
            value={service.contract_number}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Account URL</label>
          <input
            name="account_url"
            value={service.account_url}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Username</label>
          <input
            name="username"
            value={service.username}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Cost</label>
          <input
            name="cost"
            type="number"
            step="0.01"
            value={service.cost}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Start Date</label>
          <input
            name="start_date"
            type="date"
            value={service.start_date}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Next Due Date</label>
          <input
            name="next_due_date"
            type="date"
            value={service.next_due_date}
            onChange={handleChange}
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label>Notes</label>
          <textarea
            name="notes"
            value={service.notes}
            onChange={handleChange}
            rows={3}
          />
        </div>
      </div>

      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.5rem',
        }}
      >
        <button type="button" className="btn btn-warning" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  );
}

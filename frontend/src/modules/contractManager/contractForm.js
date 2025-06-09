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
    SubcategoryId: '',
    FrequencyId: ''
  });
  const [categories, setCategories]       = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [vendors, setVendors]             = useState([]);
  const [frequencies, setFrequencies]     = useState([]);

  useEffect(() => {
    getCategories().then(r => setCategories(r.data));
    getSubcategories().then(r => setSubcategories(r.data));
    getVendors().then(r => setVendors(r.data));
    getFrequencies().then(r => setFrequencies(r.data));

    if (existing) {
      setService({
        ...existing,
        VendorId: existing.VendorId || existing.vendorId,
        SubcategoryId: existing.SubcategoryId || existing.subcategoryId,
        FrequencyId: existing.FrequencyId || existing.frequencyId
      });
    }
  }, [existing]);

  const handleChange = e => {
    const { name, value } = e.target;
    setService(prev => ({ ...prev, [name]: value }));
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
      <div className="mb-2">
        <label>Category</label>
        <select
          name="SubcategoryId"
          value={service.SubcategoryId}
          onChange={handleChange}
        >
          <option value="">— select —</option>
          {subcategories.map(sc => (
            <option key={sc.id} value={sc.id}>
              {`${sc.Category.name} > ${sc.name}`}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label>Vendor</label>
        <select
          name="VendorId"
          value={service.VendorId}
          onChange={handleChange}
        >
          <option value="">— select —</option>
          {vendors.map(v => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label>Service Name</label>
        <input
          name="name"
          value={service.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-2">
        <label>Contract Number</label>
        <input
          name="contract_number"
          value={service.contract_number}
          onChange={handleChange}
        />
      </div>

      <div className="mb-2">
        <label>Account URL</label>
        <input
          name="account_url"
          value={service.account_url}
          onChange={handleChange}
        />
      </div>

      <div className="mb-2">
        <label>Username</label>
        <input
          name="username"
          value={service.username}
          onChange={handleChange}
        />
      </div>

      <div className="mb-2">
        <label>Cost</label>
        <input
          name="cost"
          type="number"
          step="0.01"
          value={service.cost}
          onChange={handleChange}
        />
      </div>

      <div className="mb-2">
        <label>Start Date</label>
        <input
          name="start_date"
          type="date"
          value={service.start_date}
          onChange={handleChange}
        />
      </div>

      <div className="mb-2">
        <label>Next Due Date</label>
        <input
          name="next_due_date"
          type="date"
          value={service.next_due_date}
          onChange={handleChange}
        />
      </div>

      <div className="mb-2">
        <label>Notes</label>
        <textarea
          name="notes"
          value={service.notes}
          onChange={handleChange}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
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

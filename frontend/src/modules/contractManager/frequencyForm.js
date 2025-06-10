// src/modules/contractManager/frequencyForm.js
import React, { useState, useEffect } from 'react';
import { createFrequency, updateFrequency } from '../../api';

export default function FrequencyForm({ existing, onSaved, onCancel }) {
  const [name, setName] = useState('');
  const [intervalMonths, setIntervalMonths] = useState('');

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setIntervalMonths(existing.interval_months?.toString() ?? '');
    } else {
      setName('');
      setIntervalMonths('');
    }
  }, [existing]);

  const handleSubmit = e => {
    e.preventDefault();

    const trimmedName = name.trim();
    const intervalVal = Number(intervalMonths);

    // Basic front-end validation
    if (!trimmedName) {
      return alert('Name is required.');
    }
    if (!intervalMonths || isNaN(intervalVal) || intervalVal < 1) {
      return alert('Interval Months must be a number of at least 1.');
    }

    const payload = {
      name: trimmedName,
      interval_months: intervalVal,
    };

    console.log('Submitting frequency:', payload);

    const action = existing
      ? updateFrequency(existing.id, payload)
      : createFrequency(payload);

    action
      .then(onSaved)
      .catch(err => {
        console.error('Frequency save error:', err);
        const msg =
          err.response?.data?.errors?.join(', ') ||
          err.response?.data?.error ||
          err.message;
        alert('Error saving frequency: ' + msg);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label>Name</label>
        <input
          name="name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          placeholder="e.g. Monthly"
        />
      </div>

      <div className="mb-2">
        <label>Interval Months</label>
        <input
          name="interval_months"
          type="number"
          min="1"
          value={intervalMonths}
          onChange={e => setIntervalMonths(e.target.value)}
          required
          placeholder="e.g. 1"
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <button type="button" className="btn btn-warning" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {existing ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}

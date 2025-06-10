// src/modules/contractManager/frequencyList.js
import React, { useEffect, useState } from 'react';
import {
  getFrequencies,
  deleteFrequency
} from '../../api';
import FrequencyForm from './frequencyForm';

export default function FrequencyList() {
  const [freqs, setFreqs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Load all frequencies
  const load = () => {
    getFrequencies()
      .then(res => setFreqs(res.data))
      .catch(err => console.error('Error loading frequencies:', err));
  };

  useEffect(load, []);

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = f => {
    setEditing(f);
    setModalOpen(true);
  };

  const handleDelete = id => {
    if (window.confirm('Delete this frequency?')) {
      deleteFrequency(id)
        .then(load)
        .catch(err => console.error('Error deleting frequency:', err));
    }
  };

  // Called after create/update
  const handleSaved = () => {
    setModalOpen(false);
    load();
  };

  return (
    <div className="container">
      <h3>Frequencies</h3>
      <button onClick={openNew} className="btn btn-primary mb-2">
        New Frequency
      </button>

      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Interval Months</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {freqs.map(f => (
            <tr key={f.id}>
              <td className="border px-4 py-2">{f.name}</td>
              <td className="border px-4 py-2">{f.interval_months}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => openEdit(f)}
                  className="btn btn-warning btn-sm mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>
            <FrequencyForm
              existing={editing}
              onSaved={handleSaved}
              onCancel={() => setModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

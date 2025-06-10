import React, { useEffect, useState } from 'react';
import {
  getFrequencies,
  createFrequency,
  updateFrequency,
  deleteFrequency
} from '../../api';
import FrequencyForm from './frequencyForm';

export default function FrequencyList() {
  const [frequencies, setFrequencies] = useState([]);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadFrequencies = () => getFrequencies().then(r => setFrequencies(r.data));
  useEffect(() => { loadFrequencies(); }, []);

  const openNew = () => { setEditing(null); setModalOpen(true); };
  const openEdit = f => { setEditing(f); setModalOpen(true); };
  const handleDelete = id => {
    if (window.confirm('Delete this frequency?')) {
      deleteFrequency(id).then(loadFrequencies);
    }
  };
  const handleSave = freq => {
    const action = editing
      ? updateFrequency(editing.id, freq)
      : createFrequency(freq);
    action.then(() => {
      setModalOpen(false);
      loadFrequencies();
    });
  };

  return (
    <div>
      <h3>Frequencies</h3>
      <button onClick={openNew} className="btn btn-primary mb-2">New Frequency</button>

      <table border="1" cellPadding="8" cellSpacing="0" style={{width:'100%'}}>
        <thead>
          <tr><th>Name</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {frequencies.map(f => (
            <tr key={f.id}>
              <td>{f.name}</td>
              <td>
                <button onClick={() => openEdit(f)} className="btn btn-warning btn-sm">Edit</button>{' '}
                <button onClick={() => handleDelete(f.id)} className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalOpen(false)}>×</button>
            <FrequencyForm existing={editing} onSaved={handleSave} onCancel={() => setModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

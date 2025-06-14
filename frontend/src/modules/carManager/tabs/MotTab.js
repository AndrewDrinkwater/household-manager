import React, { useEffect, useState } from 'react';
import { getMots, createMot, updateMot, deleteMot } from '../../../api';
import RecordForm from './RecordForm';

export default function MotTab({ carId }) {
  const [records, setRecords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const loadRecords = () => {
    getMots(carId)
      .then(res => setRecords(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    if (carId) loadRecords();
  }, [carId]);

  const openAdd = () => {
    setEditingRecord(null);
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditingRecord(record);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSave = (record) => {
    if (editingRecord) {
      updateMot(editingRecord.id, record)
        .then(() => {
          closeModal();
          loadRecords();
        })
        .catch(console.error);
    } else {
      createMot({ ...record, CarId: carId })
        .then(() => {
          closeModal();
          loadRecords();
        })
        .catch(console.error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this MOT record?')) {
      deleteMot(id)
        .then(() => loadRecords())
        .catch(console.error);
    }
  };

  return (
    <div>
      <button className="btn btn-primary mb-2" onClick={openAdd}>Add MOT Record</button>
      {records.length === 0 ? (
        <p>No MOT records found.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Test Date</th>
              <th>Expiry Date</th>
              <th>Cost (£)</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map(rec => (
              <tr key={rec.id}>
                <td>{new Date(rec.testDate).toLocaleDateString()}</td>
                <td>{new Date(rec.expiryDate).toLocaleDateString()}</td>
                <td>{rec.cost}</td>
                <td>{rec.notes || '-'}</td>
                <td>
                  <button className="btn btn-sm btn-secondary me-2" onClick={() => openEdit(rec)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(rec.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <RecordForm
              existing={editingRecord}
              onSave={handleSave}
              onCancel={closeModal}
              fields={[
                { name: 'testDate', label: 'Test Date', type: 'date', required: true },
                { name: 'expiryDate', label: 'Expiry Date', type: 'date', required: true },
                { name: 'cost', label: 'Cost (£)', type: 'number', required: false },
                { name: 'notes', label: 'Notes', type: 'text', required: false },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}

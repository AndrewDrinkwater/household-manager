import React, { useEffect, useState } from 'react';
import { getMileageRecords, createMileageRecord, updateMileageRecord, deleteMileageRecord } from '../../../api';
import RecordForm from './RecordForm';

export default function MileageTab({ carId }) {
  const [records, setRecords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const loadRecords = () => {
    getMileageRecords(carId)
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
      updateMileageRecord(editingRecord.id, record)
        .then(() => {
          closeModal();
          loadRecords();
        })
        .catch(console.error);
    } else {
      // Pass the carId separately rather than embedding it in the record
      createMileageRecord(carId, record)
        .then(() => {
          closeModal();
          loadRecords();
        })
        .catch(console.error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this mileage record?')) {
      deleteMileageRecord(id)
        .then(() => loadRecords())
        .catch(console.error);
    }
  };

  return (
    <div>
      <button className="btn btn-primary mb-2" onClick={openAdd}>Add Mileage Record</button>
      {records.length === 0 ? (
        <p>No mileage records found.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Mileage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map(rec => (
              <tr key={rec.id}>
                <td>{new Date(rec.recordDate).toLocaleDateString()}</td>
                <td>{rec.mileage}</td>
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
                { name: 'recordDate', label: 'Date', type: 'date', required: true },
                { name: 'mileage', label: 'Mileage', type: 'number', required: true },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}

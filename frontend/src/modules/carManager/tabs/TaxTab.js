import React, { useEffect, useState } from 'react';
import { getCarTaxes, createCarTax, updateCarTax, deleteCarTax } from '../../../api';
import RecordForm from './RecordForm';

export default function TaxTab({ carId, onChange }) {
  const [records, setRecords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const loadRecords = () => {
    getCarTaxes(carId)
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
      updateCarTax(editingRecord.id, record)
        .then(() => {
          closeModal();
          loadRecords();
          if (onChange) onChange();
        })
        .catch(console.error);
    } else {
      // API expects carId to be provided as the first parameter
      createCarTax(carId, record)
        .then(() => {
          closeModal();
          loadRecords();
          if (onChange) onChange();
        })
        .catch(console.error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this tax record?')) {
      deleteCarTax(id)
        .then(() => {
          loadRecords();
          if (onChange) onChange();
        })
        .catch(console.error);
    }
  };

  return (
    <div>
      <button className="btn btn-primary mb-2" onClick={openAdd}>Add Tax Record</button>
      {records.length === 0 ? (
        <p>No tax records found.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Expiry Date</th>
              <th>Cost (£)</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map(rec => (
              <tr key={rec.id}>
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

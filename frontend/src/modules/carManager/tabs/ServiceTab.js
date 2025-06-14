import React, { useEffect, useState } from 'react';
import { getServiceRecords, createServiceRecord, updateServiceRecord, deleteServiceRecord } from '../../../api';
import RecordForm from './RecordForm';

export default function ServiceTab({ carId }) {
  const [records, setRecords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const loadRecords = () => {
    getServiceRecords(carId)
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
      updateServiceRecord(editingRecord.id, record)
        .then(() => {
          closeModal();
          loadRecords();
        })
        .catch(console.error);
    } else {
      createServiceRecord({ ...record, CarId: carId })
        .then(() => {
          closeModal();
          loadRecords();
        })
        .catch(console.error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this service record?')) {
      deleteServiceRecord(id)
        .then(() => loadRecords())
        .catch(console.error);
    }
  };

  return (
    <div>
      <button className="btn btn-primary mb-2" onClick={openAdd}>Add Service Record</button>
      {records.length === 0 ? (
        <p>No service records found.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Service Date</th>
              <th>Mileage</th>
              <th>Service Type</th>
              <th>Cost (£)</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map(rec => (
              <tr key={rec.id}>
                <td>{new Date(rec.serviceDate).toLocaleDateString()}</td>
                <td>{rec.mileage || '-'}</td>
                <td>{rec.serviceType}</td>
                <td>{rec.cost || '-'}</td>
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
                { name: 'serviceDate', label: 'Service Date', type: 'date', required: true },
                { name: 'mileage', label: 'Mileage', type: 'number', required: false },
                { name: 'serviceType', label: 'Service Type', type: 'text', required: true },
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

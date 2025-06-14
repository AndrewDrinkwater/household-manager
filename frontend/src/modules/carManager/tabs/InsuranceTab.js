import React, { useEffect, useState } from 'react';
import { getInsurances, createInsurance, updateInsurance, deleteInsurance, getVendors } from '../../../api';
import RecordForm from './RecordForm';

export default function InsuranceTab({ carId }) {
  const [records, setRecords] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const loadRecords = () => {
    if (!carId) return; // safeguard
    getInsurances(carId)
      .then(res => setRecords(res.data))
      .catch(console.error);
  };

  const loadVendors = () => {
    getVendors()
      .then(res => setVendors(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    loadRecords();
    loadVendors();
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
      updateInsurance(editingRecord.id, record)
        .then(() => {
          closeModal();
          loadRecords();
        })
        .catch(console.error);
    } else {
      if (!carId) {
        console.error('carId is invalid:', carId);
        return;
      }
      createInsurance(carId, record)
        .then(() => {
          closeModal();
          loadRecords();
        })
        .catch(err => {
          console.error('Create insurance failed:', err.response?.data || err.message);
        });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this insurance record?')) {
      deleteInsurance(id)
        .then(() => loadRecords())
        .catch(console.error);
    }
  };

  return (
    <div>
      <button className="btn btn-primary mb-2" onClick={openAdd}>Add Insurance Record</button>
      {records.length === 0 ? (
        <p>No insurance records found.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Policy Number</th>
              <th>Expiry Date</th>
              <th>Cost (£)</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map(rec => {
              // vendors and rec are in scope here, no ESLint issues
              const vendor = vendors.find(v => v.id === Number(rec.provider));
              return (
                <tr key={rec.id}>
                  <td>{vendor ? vendor.name : 'Unknown'}</td>
                  <td>{rec.policyNumber}</td>
                  <td>{new Date(rec.expiryDate).toLocaleDateString()}</td>
                  <td>{rec.cost}</td>
                  <td>{rec.notes || '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-secondary me-2" onClick={() => openEdit(rec)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(rec.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
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
                {
                  name: 'provider',
                  label: 'Provider',
                  type: 'select',
                  required: true,
                  options: vendors.map(v => ({ value: v.id, label: v.name })),
                },
                { name: 'policyNumber', label: 'Policy Number', type: 'text', required: true },
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

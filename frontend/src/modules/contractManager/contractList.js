// src/modules/contractManager/contractList.js
import React, { useEffect, useState } from 'react';
import { getServices, deleteService } from '../../api';
import ContractForm                     from './contractForm';

export default function ContractList() {
  const [contracts, setContracts] = useState([]);
  const [editing, setEditing]     = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadContracts = () =>
    getServices().then(res => setContracts(res.data));

  useEffect(() => {
    loadContracts();
  }, []);

  const openNew  = () => { setEditing(null); setModalOpen(true); };
  const openEdit = c    => { setEditing(c);    setModalOpen(true); };
  const handleDelete = id => {
    if (window.confirm('Delete this contract?')) {
      deleteService(id).then(loadContracts);
    }
  };
  const handleSaved = () => {
    setModalOpen(false);
    loadContracts();
  };

  return (
    <div className="container">
      <h3>Services</h3>
      <button onClick={openNew} className="btn btn-primary mb-2">
        New Service
      </button>

      <table className="fixed-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contract #</th>
            <th>Vendor</th>
            <th>Username</th>
            <th>Start Date</th>
            <th>Next Due</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.contract_number}</td>
              <td>{c.Vendor?.name}</td>
              <td>{c.username}</td>
              <td>{new Date(c.start_date).toLocaleDateString('en-GB')}</td>
              <td>{new Date(c.next_due_date).toLocaleDateString('en-GB')}</td>
              <td>{c.notes}</td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={() => openEdit(c)}
                    className="btn btn-warning btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>
            <ContractForm
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

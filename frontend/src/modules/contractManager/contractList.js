// src/modules/contractManager/contractList.js
import React, { useEffect, useState } from 'react';
import { getContracts, deleteContract } from '../../api';
import ContractForm from './contractForm';

export default function ContractList() {
  const [contracts, setContracts]     = useState([]);
  const [editing, setEditing]         = useState(null);
  const [modalOpen, setModalOpen]     = useState(false);

  // Load contracts
  const loadContracts = () =>
    getContracts().then(res => setContracts(res.data));

  useEffect(() => {
    loadContracts();
  }, []);

  // Handlers
  const openNew  = () => { setEditing(null); setModalOpen(true); };
  const openEdit = c    => { setEditing(c);    setModalOpen(true); };
  const handleDelete = id => {
    if (window.confirm('Delete this contract?')) {
      deleteContract(id).then(loadContracts);
    }
  };
  const handleSaved = () => {
    setModalOpen(false);
    loadContracts();
  };

  // Inline modal styles
  const backdropStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000
  };
  const boxStyle = {
    background: 'var(--bg)',
    color: 'var(--text-light)',
    borderRadius: '8px',
    padding: '1.5rem',
    width: '90%',
    maxWidth: '500px',
    position: 'relative',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
  };
  const closeBtnStyle = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    background: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    color: 'var(--text-light)',
    cursor: 'pointer'
  };

  return (
    <div className="container">
      <h3>Contracts</h3>
      <button
        onClick={openNew}
        className="btn btn-primary mb-2"
      >
        New Contract
      </button>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Number</th>
            <th>Vendor</th>
            <th>User</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Renewal</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.contract_number}</td>
              <td>{c.Vendor?.name || c.vendorId}</td>
              <td>{c.User?.username || c.userId}</td>
              <td>{c.start_date}</td>
              <td>{c.end_date}</td>
              <td>{c.renewal_date}</td>
              <td>{c.notes}</td>
              <td>
                <button
                  onClick={() => openEdit(c)}
                  className="btn btn-warning btn-sm"
                >
                  Edit
                </button>{' '}
                <button
                  onClick={() => handleDelete(c.id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Inline Modal */}
      {modalOpen && (
        <div style={backdropStyle} onClick={() => setModalOpen(false)}>
          <div style={boxStyle} onClick={e => e.stopPropagation()}>
            <button
              style={closeBtnStyle}
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

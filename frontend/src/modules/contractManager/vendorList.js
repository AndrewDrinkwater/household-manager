// src/modules/contractManager/vendorList.js
import React, { useEffect, useState } from 'react';
import { getVendors, createVendor, updateVendor, deleteVendor } from '../../api';
import VendorForm from './vendorForm';

export default function VendorList() {
  const [vendors, setVendors]     = useState([]);
  const [editing, setEditing]     = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Load vendors
  const loadVendors = () =>
    getVendors().then(res => setVendors(res.data));

  useEffect(() => {
    loadVendors();
  }, []);

  // Handlers
  const openNew  = () => { setEditing(null); setModalOpen(true); };
  const openEdit = v    => { setEditing(v);    setModalOpen(true); };
  const handleDelete = id => {
    if (window.confirm('Delete this vendor?')) {
      deleteVendor(id).then(loadVendors);
    }
  };
  const handleSave = vendor => {
    const action = editing
      ? updateVendor(editing.id, vendor)
      : createVendor(vendor);
    action.then(() => {
      setModalOpen(false);
      loadVendors();
    });
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
    maxWidth: '400px',
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
      <h3>Vendors</h3>
      <button
        onClick={openNew}
        className="btn btn-primary mb-2"
      >
        New Vendor
      </button>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact Info</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map(v => (
            <tr key={v.id}>
              <td>{v.name}</td>
              <td>{v.contact_info}</td>
              <td>{v.notes}</td>
              <td>
                <button
                  onClick={() => openEdit(v)}
                  className="btn btn-warning btn-sm"
                >
                  Edit
                </button>{' '}
                <button
                  onClick={() => handleDelete(v.id)}
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
        <div style={backdropStyle} onClick={() => setModalOpen(false)}>
          <div style={boxStyle} onClick={e => e.stopPropagation()}>
            <button
              style={closeBtnStyle}
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>
            <VendorForm
              existing={editing}
              onSaved={handleSave}
              onCancel={() => setModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

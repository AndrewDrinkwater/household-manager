import React, { useEffect, useState } from 'react';
import { getVendors, createVendor, updateVendor, deleteVendor } from '../../api';
import VendorForm from './vendorForm';
import Modal from '../../components/ui/modal';

export default function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadVendors = () => getVendors().then(r => setVendors(r.data));
  useEffect(() => { loadVendors(); }, []);

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = v => {
    setEditing(v);
    setModalOpen(true);
  };
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

  return (
    <div>
      <h3>Vendors</h3>
      <button onClick={openNew} style={{ marginBottom: '1rem' }}>New Vendor</button>

      <table border="1" cellPadding="8" cellSpacing="0">
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
                <button onClick={() => openEdit(v)}>Edit</button>
                <button onClick={() => handleDelete(v.id)} style={{ marginLeft: 8 }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <VendorForm
            existing={editing}
            onSaved={handleSave}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}

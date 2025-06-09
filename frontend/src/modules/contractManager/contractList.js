import React, { useEffect, useState } from 'react';
import { getContracts, deleteContract } from '../../api';
import ContractForm from './contractForm';
import Modal from '../../components/ui/modal';

export default function ContractList() {
  const [contracts, setContracts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadContracts = () =>
    getContracts().then(res => setContracts(res.data));

  useEffect(() => { loadContracts(); }, []);

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = contract => {
    setEditing(contract);
    setModalOpen(true);
  };

  const handleDelete = id => {
    if (window.confirm('Delete this contract?')) {
      deleteContract(id).then(loadContracts);
    }
  };

  const handleSaved = () => {
    setModalOpen(false);
    loadContracts();
  };

  return (
    <div>
      <h3>Contracts</h3>
      <button onClick={openNew} style={{ marginBottom: '1rem' }}>New Contract</button>
      
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Name</th><th>Number</th><th>Vendor</th><th>User</th>
            <th>Start Date</th><th>End Date</th><th>Renewal</th>
            <th>Notes</th><th>Actions</th>
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
                <button onClick={() => openEdit(c)}>Edit</button>
                <button onClick={() => handleDelete(c.id)} style={{ marginLeft: 8 }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <ContractForm
            existing={editing}
            onSaved={handleSaved}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}

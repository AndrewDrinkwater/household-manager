import React, { useEffect, useState } from 'react';
import { getContracts, deleteContract } from '../../api';
import ContractForm from './contractForm';

export default function ContractList() {
  const [contracts, setContracts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadContracts = () => {
    getContracts().then(res => setContracts(res.data));
  };

  useEffect(() => {
    loadContracts();
  }, []);

  const handleEdit = (contract) => {
    setEditing(contract);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this contract?')) {
      deleteContract(id).then(loadContracts);
    }
  };

  const handleFormSaved = () => {
    setEditing(null);
    setShowForm(false);
    loadContracts();
  };

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  return (
    <div>
      <h3>Contracts</h3>

      {!showForm && (
        <button onClick={handleAdd} style={{ marginBottom: '1rem' }}>
          Add Contract
        </button>
      )}

      {showForm && (
        <ContractForm
          existing={editing}
          onSaved={handleFormSaved}
          onCancel={() => setShowForm(false)}
        />
      )}

      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Number</th>
            <th>Vendor</th>
            <th>User</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Renewal Date</th>
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
                <button onClick={() => handleEdit(c)}>Edit</button>
                <button
                  onClick={() => handleDelete(c.id)}
                  style={{ marginLeft: '0.5rem' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { getContracts, deleteContract } from '../../api';
import ContractForm from './contractForm';

function ContractList() {
  const [contracts, setContracts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadContracts = () =>
    getContracts().then(res => setContracts(res.data));

  useEffect(() => { loadContracts(); }, []);

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
      <h2>Contracts</h2>
      {!showForm && (
        <button onClick={handleAdd} style={{ marginBottom: '1rem' }}>Add Contract</button>
      )}
      {showForm && (
        <ContractForm
          existing={editing}
          onSaved={handleFormSaved}
          onCancel={() => setShowForm(false)}
        />
      )}
      <ul>
        {contracts.map(contract => (
          <li key={contract.id}>
            <strong>{contract.name}</strong> (#{contract.contract_number})<br />
            Vendor: {contract.vendor ? contract.vendor.name : contract.vendorId}<br />
            User: {contract.user ? contract.user.username : contract.userId}<br />
            Start: {contract.start_date} | End: {contract.end_date}<br />
            Renewal: {contract.renewal_date}<br />
            Notes: {contract.notes}
            <br />
            <button onClick={() => handleEdit(contract)}>Edit</button>
            <button onClick={() => handleDelete(contract.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContractList;

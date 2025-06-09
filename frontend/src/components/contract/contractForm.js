import React, { useState, useEffect } from 'react';
import { createContract, updateContract, getVendors, getUsers } from '../../api';

function ContractForm({ existing, onSaved, onCancel }) {
  const [contract, setContract] = useState(
    existing || {
      name: '',
      contract_number: '',
      start_date: '',
      end_date: '',
      renewal_date: '',
      notes: '',
      vendorId: '',
      userId: ''
    }
  );
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getVendors().then(res => setVendors(res.data));
    getUsers().then(res => setUsers(res.data));
  }, []);

  const handleChange = (e) => {
    setContract({ ...contract, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitAction = existing
      ? updateContract(existing.id, contract)
      : createContract(contract);
    submitAction.then(() => onSaved());
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '1rem 0' }}>
      <input
        name="name"
        value={contract.name}
        onChange={handleChange}
        placeholder="Contract name"
        required
      />
      <input
        name="contract_number"
        value={contract.contract_number}
        onChange={handleChange}
        placeholder="Contract number"
      />
      <input
        type="date"
        name="start_date"
        value={contract.start_date}
        onChange={handleChange}
        placeholder="Start date"
      />
      <input
        type="date"
        name="end_date"
        value={contract.end_date}
        onChange={handleChange}
        placeholder="End date"
      />
      <input
        type="date"
        name="renewal_date"
        value={contract.renewal_date}
        onChange={handleChange}
        placeholder="Renewal date"
      />
      <select
        name="vendorId"
        value={contract.vendorId}
        onChange={handleChange}
        required
      >
        <option value="">Select vendor</option>
        {vendors.map(v => (
          <option key={v.id} value={v.id}>{v.name}</option>
        ))}
      </select>
      <select
        name="userId"
        value={contract.userId}
        onChange={handleChange}
        required
      >
        <option value="">Select user</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>{u.username}</option>
        ))}
      </select>
      <input
        name="notes"
        value={contract.notes}
        onChange={handleChange}
        placeholder="Notes"
      />
      <button type="submit">{existing ? 'Update' : 'Add'} Contract</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
}

export default ContractForm;

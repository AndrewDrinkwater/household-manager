import React, { useState, useEffect } from 'react';
import { createContract, updateContract, getVendors, getUsers } from '../../api';

export default function ContractForm({ existing, onSaved, onCancel }) {
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
    getVendors().then(r => setVendors(r.data));
    getUsers().then(r => setUsers(r.data));
    if (existing) setContract(existing);
  }, [existing]);

  const handleChange = e => {
    setContract({ ...contract, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!contract.vendorId || !contract.userId) {
      alert('Please select both a vendor and a user.');
      return;
    }

    const payload = {
      name:            contract.name,
      contract_number: contract.contract_number,
      start_date:      contract.start_date,
      end_date:        contract.end_date,
      renewal_date:    contract.renewal_date,
      notes:           contract.notes,
      VendorId:        Number(contract.vendorId),
      UserId:          Number(contract.userId)
    };

    const action = existing
      ? updateContract(existing.id, payload)
      : createContract(payload);

    action
      .then(() => onSaved())
      .catch(err => {
        console.error(err.response?.data || err.message);
        const msg = err.response?.data?.error
          || JSON.stringify(err.response?.data)
          || err.message;
        alert('Error saving contract: ' + msg);
      });
  };

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem'
  };

  const labelStyle = { marginBottom: '0.25rem', fontWeight: 'bold' };
  const inputStyle = { padding: '0.5rem', fontSize: '1rem' };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
      <div style={fieldStyle}>
        <label style={labelStyle}>Name</label>
        <input
          style={inputStyle}
          name="name"
          value={contract.name}
          onChange={handleChange}
          required
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Contract Number</label>
        <input
          style={inputStyle}
          name="contract_number"
          value={contract.contract_number}
          onChange={handleChange}
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ ...fieldStyle, flex: 1 }}>
          <label style={labelStyle}>Start Date</label>
          <input
            style={inputStyle}
            type="date"
            name="start_date"
            value={contract.start_date}
            onChange={handleChange}
          />
        </div>
        <div style={{ ...fieldStyle, flex: 1 }}>
          <label style={labelStyle}>End Date</label>
          <input
            style={inputStyle}
            type="date"
            name="end_date"
            value={contract.end_date}
            onChange={handleChange}
          />
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Renewal Date</label>
        <input
          style={inputStyle}
          type="date"
          name="renewal_date"
          value={contract.renewal_date}
          onChange={handleChange}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Vendor</label>
        <select
          style={inputStyle}
          name="vendorId"
          value={contract.vendorId}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select vendor</option>
          {vendors.map(v => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>User</label>
        <select
          style={inputStyle}
          name="userId"
          value={contract.userId}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select user</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.username}</option>
          ))}
        </select>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Notes</label>
        <textarea
          style={{ ...inputStyle, minHeight: '80px' }}
          name="notes"
          value={contract.notes}
          onChange={handleChange}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <button type="button" onClick={onCancel} style={{ padding: '0.5rem 1rem' }}>
          Cancel
        </button>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          {existing ? 'Update' : 'Add'} Contract
        </button>
      </div>
    </form>
  );
}

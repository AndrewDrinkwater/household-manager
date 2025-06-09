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
  name:              contract.name,
  contract_number:   contract.contract_number,
  start_date:        contract.start_date,
  end_date:          contract.end_date,
  renewal_date:      contract.renewal_date,
  notes:             contract.notes,
  VendorId:          Number(contract.vendorId),
  UserId:            Number(contract.userId),
};
    const action = existing
      ? updateContract(existing.id, payload)
      : createContract(payload);

    action
  .then(() => onSaved())
  .catch(err => {
    // Log full response data for debugging
    console.error('Save error details:', err.response?.data || err.message);

    // Construct a user‐friendly message
    const serverMsg = err.response?.data?.error
      || (err.response?.data && JSON.stringify(err.response.data))
      || err.message;

    alert('Error saving contract: ' + serverMsg);
  });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <table border="1" cellPadding="6" cellSpacing="0" style={{ width: '100%', marginBottom: '0.5rem' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Number</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Renewal Date</th>
            <th>Vendor</th>
            <th>User</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                name="name"
                value={contract.name}
                onChange={handleChange}
                placeholder="Name"
                required
              />
            </td>
            <td>
              <input
                name="contract_number"
                value={contract.contract_number}
                onChange={handleChange}
                placeholder="Number"
              />
            </td>
            <td>
              <input
                type="date"
                name="start_date"
                value={contract.start_date}
                onChange={handleChange}
              />
            </td>
            <td>
              <input
                type="date"
                name="end_date"
                value={contract.end_date}
                onChange={handleChange}
              />
            </td>
            <td>
              <input
                type="date"
                name="renewal_date"
                value={contract.renewal_date}
                onChange={handleChange}
              />
            </td>
            <td>
              <select
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
            </td>
            <td>
              <select
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
            </td>
            <td>
              <input
                name="notes"
                value={contract.notes}
                onChange={handleChange}
                placeholder="Notes"
              />
            </td>
            <td>
              <button type="submit">
                {existing ? 'Update' : 'Add'}
              </button>
              {onCancel && (
                <button type="button" onClick={onCancel} style={{ marginLeft: '0.5rem' }}>
                  Cancel
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
}

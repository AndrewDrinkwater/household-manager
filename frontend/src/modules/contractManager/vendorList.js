import React, { useEffect, useState } from 'react';
import { getVendors, createVendor } from '../../api';

function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [notes, setNotes] = useState('');

  const loadVendors = () => getVendors().then(res => setVendors(res.data));

  useEffect(() => { loadVendors(); }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    createVendor({ name, contact_info: contactInfo, notes })
      .then(() => {
        setName(''); setContactInfo(''); setNotes('');
        loadVendors();
      });
  };

  return (
    <div>
      <h2>Vendors</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: '1rem' }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Vendor name"
          required
        />
        <input
          value={contactInfo}
          onChange={e => setContactInfo(e.target.value)}
          placeholder="Contact info"
        />
        <input
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Notes"
        />
        <button type="submit">Add Vendor</button>
      </form>
      <ul>
        {vendors.map(v => (
          <li key={v.id}>
            <strong>{v.name}</strong> — {v.contact_info} ({v.notes})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VendorList;

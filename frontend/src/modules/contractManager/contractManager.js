import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import ContractList from './contractList';
import VendorList from './vendorList';

export default function ContractManager() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Contract Management</h2>

      <nav style={{ marginBottom: '1rem' }}>
        <Link to="/contracts" style={{ marginRight: 16 }}>Contracts</Link>
        <Link to="/contracts/vendors">Vendors</Link>
      </nav>

      <Routes>
        <Route path="vendors" element={<VendorList />} />
        <Route path="contracts" element={<ContractList />} />
        <Route
          path="/contracts/*"
          element={<div>Select “Contracts” or “Vendors” above to begin.</div>}
        />
      </Routes>
    </div>
  );
}

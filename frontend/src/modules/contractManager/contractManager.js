import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ContractList from './contractList';
import VendorList from './vendorList';

export default function ContractManager() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Contract Management</h2>

      <nav style={{ marginBottom: '1rem' }}>
        {/* Link to the default child route (contracts list) */}
        <Link to="/contracts" style={{ marginRight: 16 }}>
          Contracts
        </Link>
        <Link to="/contracts/vendors">
          Vendors
        </Link>
      </nav>

      <Routes>
        {/* Default path under /contracts shows the contracts list */}
        <Route path="" element={<ContractList />} />

        {/* /contracts/vendors shows the vendor list */}
        <Route path="vendors" element={<VendorList />} />

        {/* Fallback for any other nested route */}
        <Route
          path="*"
          element={<div>Select “Contracts” or “Vendors” above to begin.</div>}
        />
      </Routes>
    </div>
  );
}

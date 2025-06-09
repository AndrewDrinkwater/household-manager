import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ContractList from './contractList';
import VendorList from './vendorList';

export default function ContractManager() {
  return (
    <div>
      <h2>Contract Management</h2>
      <nav>
        <Link to="contracts" style={{ marginRight: 16 }}>Contracts</Link>
        <Link to="vendors">Vendors</Link>
      </nav>
      <Routes>
        <Route path="contracts" element={<ContractList />} />
        <Route path="vendors" element={<VendorList />} />
        <Route path="/" element={<div>Select an option above.</div>} />
      </Routes>
    </div>
  );
}

// src/modules/contractManager/contractManager.js
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ContractList from './contractList';
import VendorList from './vendorList';

function SubNavTabs() {
  const { pathname } = useLocation();
  return (
    <div className="sub-nav-tabs">
      <Link
        to="/contracts"
        className={pathname === '/contracts' ? 'active' : ''}
      >
        Contracts
      </Link>
      <Link
        to="/contracts/vendors"
        className={pathname === '/contracts/vendors' ? 'active' : ''}
      >
        Vendors
      </Link>
    </div>
  );
}

export default function ContractManager() {
  return (
    <div>
      {/* Sub‐tab navigation */}
      <SubNavTabs />

      <Routes>
        <Route path="" element={<ContractList />} />
        <Route path="vendors" element={<VendorList />} />
        <Route
          path="*"
          element={<div>Select “Contracts” or “Vendors” above to begin.</div>}
        />
      </Routes>
    </div>
  );
}

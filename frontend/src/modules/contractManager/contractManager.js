// src/modules/contractManager/contractManager.js
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ContractList from './contractList';
import VendorList   from './vendorList';
import CategoryList from './categoryList';

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
      <Link
        to="/contracts/categories"
        className={pathname === '/contracts/categories' ? 'active' : ''}
      >
        Categories
      </Link>
    </div>
  );
}

export default function ContractManager() {
  return (
    <div>
      <SubNavTabs />

      <Routes>
        <Route path=""            element={<ContractList />} />
        <Route path="vendors"     element={<VendorList />} />
        <Route path="categories"  element={<CategoryList />} />
        <Route
          path="*"
          element={<div>Select “Contracts”, “Vendors” or “Categories” above.</div>}
        />
      </Routes>
    </div>
  );
}

import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import BudgetGrid from './budgetGrid';
import SavingsTab from './savingsTab';

function SubNavTabs() {
  const { pathname } = useLocation();
  return (
    <div className="sub-nav-tabs">
      <Link to="/budget" className={pathname === '/budget' ? 'active' : ''}>
        Budget
      </Link>
      <Link to="/budget/savings" className={pathname === '/budget/savings' ? 'active' : ''}>
        Savings
      </Link>
    </div>
  );
}

export default function BudgetManager() {
  return (
    <div>
      <SubNavTabs />
      <Routes>
        <Route path="" element={<BudgetGrid />} />
        <Route path="savings" element={<SavingsTab />} />
        <Route path="*" element={<BudgetGrid />} />
      </Routes>
    </div>
  );
}

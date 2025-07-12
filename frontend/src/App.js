// src/App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from 'react-router-dom';
import HomePage from './components/home/homePage';
import ContractManager from './modules/contractManager/contractManager';
import CarManager from './modules/carManager/carManager';  // new
import BacklogManager from './modules/backlogManager/backlogManager';
import UserManager from './modules/userManager/userManager';
import FinanceManager from './modules/financeManager/financeManager';
import ThemeToggle from './components/ui/ThemeToggle';
import SpinWheel from './modules/spinWheel/SpinWheel';
import AdminSpinConfig from './modules/spinWheel/AdminSpinConfig';

function NavTabs() {
  const { pathname } = useLocation();
  return (
    <div className="nav-tabs">
      <div className="nav-links">
        <Link to="/" className={pathname === '/' ? 'active' : ''}>
          Home
        </Link>
      <Link
        to="/contracts"
        className={pathname.startsWith('/contracts') ? 'active' : ''}
      >
        Service Management
      </Link>
      <Link
        to="/cars"
        className={pathname.startsWith('/cars') ? 'active' : ''}
      >
        Car Management
      </Link>
      <Link
        to="/backlog"
        className={pathname.startsWith('/backlog') ? 'active' : ''}
      >
        Backlog
      </Link>
      <Link
        to="/finance"
        className={pathname.startsWith('/finance') ? 'active' : ''}
      >
        Finance
      </Link>
      <Link
        to="/spin"
        className={pathname.startsWith('/spin') ? 'active' : ''}
      >
        Spin Wheel
      </Link>
      <Link
        to="/admin/users"
        className={pathname === '/admin/users' ? 'active' : ''}
      >
        User Management
      </Link>
      </div>
      <ThemeToggle />
    </div>
  );
}

function PageHeader() {
  const { pathname } = useLocation();
  let title;
  if (pathname === '/') {
    title = 'Home';
  } else if (pathname.startsWith('/contracts')) {
    title = 'Service Management';
  } else if (pathname.startsWith('/cars')) {
    title = 'Car Management';
  } else if (pathname.startsWith('/backlog')) {
    title = 'Backlog';
  } else if (pathname.startsWith('/finance')) {
    title = 'Finance';
  } else if (pathname.startsWith('/spin')) {
    title = 'Spin Wheel';
  } else if (pathname === '/admin/users') {
    title = 'User Management (Admin Only)';
  } else if (pathname === '/admin/spin') {
    title = 'Spin Config';
  } else {
    title = '';
  }

  return title ? <h1 className="page-header">{title}</h1> : null;
}

export default function App() {
  return (
    <Router>
      <div className="container">
        <NavTabs />
        <PageHeader />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contracts/*" element={<ContractManager />} />
          <Route path="/cars/*" element={<CarManager />} />  {/* new */}
        <Route path="/backlog" element={<BacklogManager />} />
        <Route path="/finance" element={<FinanceManager />} />
        <Route path="/spin" element={<SpinWheel />} />
        <Route path="/admin/spin" element={<AdminSpinConfig />} />
        <Route path="/admin/users" element={<UserManager />} />
        </Routes>
      </div>
    </Router>
  );
}

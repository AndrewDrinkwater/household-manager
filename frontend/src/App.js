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
import UserManager from './modules/userManager/userManager';

function NavTabs() {
  const { pathname } = useLocation();
  return (
    <div className="nav-tabs">
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
        to="/admin/users"
        className={pathname === '/admin/users' ? 'active' : ''}
      >
        User Management
      </Link>
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
  } else if (pathname === '/admin/users') {
    title = 'User Management (Admin Only)';
  } else {
    title = ''; // or fallback
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
          <Route path="/admin/users" element={<UserManager />} />
        </Routes>
      </div>
    </Router>
  );
}

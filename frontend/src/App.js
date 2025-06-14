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
  } else if (pathname.startsWith('/cars')) {
    title = 'Car Management';
  } else if (pathname.startsWith('/backlog')) {
    title = 'Backlog';
  } else if (pathname === '/admin/users') {
    title = 'User Management (Admin Only)';
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
          <Route path="/admin/users" element={<UserManager />} />
        </Routes>
      </div>
    </Router>
  );
}

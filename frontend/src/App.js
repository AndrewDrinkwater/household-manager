import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import HomePage from './components/home/homePage';
import ContractManager from './modules/contractManager/contractManager';
import UserManager from './modules/userManager/userManager';

function App() {
  return (
    <Router>
      <div style={{ padding: '1rem' }}>
        <nav style={{ marginBottom: '2rem' }}>
          <Link to="/" style={{ marginRight: 16 }}>Home</Link>
          <Link to="/contracts" style={{ marginRight: 16 }}>Contract Management</Link>
          <Link to="/admin/users">User Management</Link>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contracts/*" element={<ContractManager />} />
          <Route path="/admin/users" element={<UserManager />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

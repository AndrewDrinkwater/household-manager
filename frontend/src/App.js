import React from 'react';
import VendorList from './components/vendor/vendorList';
import ContractList from './components/contract/contractList';
import UserList from './components/user/userList';

function App() {
  return (
    <div>
      <h1>Household Manager</h1>
      <VendorList />
      <ContractList />
      <UserList />
    </div>
  );
}

export default App;


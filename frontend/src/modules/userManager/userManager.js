import React from 'react';
import UserList from './userList';

export default function UserManager() {
  return (
    <div>
      <h2>User Management (Admin Only)</h2>
      <UserList />
    </div>
  );
}

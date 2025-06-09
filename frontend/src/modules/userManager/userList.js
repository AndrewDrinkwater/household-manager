// src/modules/userManager/userList.js
import React, { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../../api';
import UserForm from './userForm';

export default function UserList() {
  const [users, setUsers]         = useState([]);
  const [editing, setEditing]     = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Load users from the API
  const loadUsers = () =>
    getUsers().then(res => setUsers(res.data));

  useEffect(() => {
    loadUsers();
  }, []);

  // Handlers
  const openNew  = () => { setEditing(null); setModalOpen(true); };
  const openEdit = u    => { setEditing(u);    setModalOpen(true); };
  const handleDelete = id => {
    if (window.confirm('Delete this user?')) {
      deleteUser(id).then(loadUsers);
    }
  };
  const handleSave = user => {
    const action = editing
      ? updateUser(editing.id, user)
      : createUser(user);
    action.then(() => {
      setModalOpen(false);
      loadUsers();
    });
  };

  // Inline modal styles
  const backdropStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000
  };
  const boxStyle = {
    background: 'var(--bg)',
    color: 'var(--text-light)',
    borderRadius: '8px',
    padding: '1.5rem',
    width: '90%',
    maxWidth: '500px',
    position: 'relative',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
  };
  const closeBtnStyle = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    background: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    color: 'var(--text-light)',
    cursor: 'pointer'
  };

  return (
    <div className="container">
      <h3>Users</h3>
      <button
        onClick={openNew}
        className="btn btn-primary mb-2"
      >
        New User
      </button>

      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button
                  onClick={() => openEdit(u)}
                  className="btn btn-warning btn-sm"
                >
                  Edit
                </button>{' '}
                <button
                  onClick={() => handleDelete(u.id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Inline Modal */}
      {modalOpen && (
        <div style={backdropStyle} onClick={() => setModalOpen(false)}>
          <div style={boxStyle} onClick={e => e.stopPropagation()}>
            <button
              style={closeBtnStyle}
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>
            <UserForm
              existing={editing}
              onSaved={handleSave}
              onCancel={() => setModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

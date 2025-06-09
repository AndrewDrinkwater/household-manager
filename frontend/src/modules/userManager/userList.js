import React, { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../../api';
import UserForm from './userForm';
import Modal from '../../components/ui/modal';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadUsers = () => getUsers().then(r => setUsers(r.data));
  useEffect(() => { loadUsers(); }, []);

  const openNew = () => { setEditing(null); setModalOpen(true); };
  const openEdit = u => { setEditing(u); setModalOpen(true); };
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

  return (
    <div>
      <h3>Users</h3>
      <button onClick={openNew} style={{ marginBottom: '1rem' }}>New User</button>

      <table border="1" cellPadding="8" cellSpacing="0">
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
                <button onClick={() => openEdit(u)}>Edit</button>
                <button onClick={() => handleDelete(u.id)} style={{ marginLeft: 8 }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <UserForm
            existing={editing}
            onSaved={handleSave}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}

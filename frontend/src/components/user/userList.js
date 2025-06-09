import React, { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../../api';

function UserList() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password_hash: '',
    role: 'user'
  });
  const [editing, setEditing] = useState(null);

  const loadUsers = () => getUsers().then(res => setUsers(res.data));

  useEffect(() => { loadUsers(); }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (editing) {
      updateUser(editing.id, form).then(() => {
        setEditing(null);
        setForm({ username: '', email: '', password_hash: '', role: 'user' });
        loadUsers();
      });
    } else {
      createUser(form).then(() => {
        setForm({ username: '', email: '', password_hash: '', role: 'user' });
        loadUsers();
      });
    }
  };

  const handleEdit = user => {
    setEditing(user);
    setForm({
      username: user.username,
      email: user.email,
      password_hash: '', // Don't display the hash
      role: user.role
    });
  };

  const handleDelete = id => {
    if (window.confirm('Delete this user?')) {
      deleteUser(id).then(loadUsers);
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ username: '', email: '', password_hash: '', role: 'user' });
  };

  return (
    <div>
      <h2>Users</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          name="password_hash"
          type="password"
          value={form.password_hash}
          onChange={handleChange}
          placeholder={editing ? "New Password (optional)" : "Password"}
          required={!editing}
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">{editing ? "Update" : "Add"} User</button>
        {editing && <button type="button" onClick={handleCancel}>Cancel</button>}
      </form>
      <ul>
        {users.map(u => (
          <li key={u.id}>
            <strong>{u.username}</strong> ({u.email}) — <em>{u.role}</em>
            <button style={{marginLeft: '1rem'}} onClick={() => handleEdit(u)}>Edit</button>
            <button style={{marginLeft: '0.5rem'}} onClick={() => handleDelete(u.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;

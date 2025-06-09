import React, { useEffect, useState } from 'react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../../api';
import CategoryForm from './categoryForm';

export default function CategoryList() {
  const [cats, setCats]       = useState([]);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

   const load = () => getCategories().then(r => setCats(r.data));
  useEffect(() => {
    load();
  }, []);

  const openNew  = () => { setEditing(null); setModalOpen(true); };
  const openEdit = c    => { setEditing(c);    setModalOpen(true); };
  const remove   = id   => {
    if (window.confirm('Delete this category?')) {
      deleteCategory(id).then(load);
    }
  };
  const saved = () => {
    setModalOpen(false);
    load();
  };

  return (
    <div className="container">
      <h3>Categories</h3>
      <button onClick={openNew} className="btn btn-primary mb-2">
        New Category
      </button>

      <table>
        <thead>
          <tr>
            <th>Name</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cats.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>
                <button
                  onClick={() => openEdit(c)}
                  className="btn btn-warning btn-sm"
                >
                  Edit
                </button>{' '}
                <button
                  onClick={() => remove(c.id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>
            <CategoryForm
              existing={editing}
              onSaved={saved}
              onCancel={() => setModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

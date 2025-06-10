// src/modules/contractManager/categoryList.js
import React, { useEffect, useState } from 'react';
import {
  getCategories,
  getSubcategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from '../../api';
import CategoryForm from './categoryForm';
import SubcategoryForm from './subcategoryForm';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [editingCat, setEditingCat] = useState(null);
  const [editingSubcat, setEditingSubcat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('category'); // or 'subcategory'

  const loadData = () => {
    getCategories().then(r => setCategories(r.data));
    getSubcategories().then(r => setSubcategories(r.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNewCategory = () => {
    setEditingCat(null);
    setModalType('category');
    setModalOpen(true);
  };
  const openEditCategory = c => {
    setEditingCat(c);
    setModalType('category');
    setModalOpen(true);
  };
  const deleteCategoryById = id => {
    if (window.confirm('Delete this category?')) {
      deleteCategory(id).then(loadData);
    }
  };

  const openNewSubcategory = () => {
    setEditingSubcat(null);
    setModalType('subcategory');
    setModalOpen(true);
  };
  const openEditSubcategory = sc => {
    setEditingSubcat(sc);
    setModalType('subcategory');
    setModalOpen(true);
  };
  const deleteSubcategoryById = id => {
    if (window.confirm('Delete this subcategory?')) {
      deleteSubcategory(id).then(loadData);
    }
  };

  const saved = () => {
    setModalOpen(false);
    loadData();
  };

  return (
    <div className="container">
      <h3>Categories & Subcategories</h3>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={openNewCategory} className="btn btn-primary" style={{ marginRight: '1rem' }}>
          New Category
        </button>
        <button onClick={openNewSubcategory} className="btn btn-secondary">
          New Subcategory
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Parent Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(c => (
            <tr key={`cat-${c.id}`}>
              <td>{c.name}</td>
              <td>Category</td>
              <td>—</td>
              <td>
                <button
                  onClick={() => openEditCategory(c)}
                  className="btn btn-warning btn-sm"
                  style={{ marginRight: '0.5rem' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCategoryById(c.id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {subcategories.map(sc => (
            <tr key={`subcat-${sc.id}`}>
              <td>{sc.name}</td>
              <td>Subcategory</td>
              <td>{sc.Category?.name || '—'}</td>
              <td>
                <button
                  onClick={() => openEditSubcategory(sc)}
                  className="btn btn-warning btn-sm"
                  style={{ marginRight: '0.5rem' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteSubcategoryById(sc.id)}
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
            <button className="modal-close" onClick={() => setModalOpen(false)}>
              ×
            </button>

            {modalType === 'category' ? (
              <CategoryForm
                existing={editingCat}
                onSaved={saved}
                onCancel={() => setModalOpen(false)}
              />
            ) : (
              <SubcategoryForm
                existing={editingSubcat}
                onSaved={saved}
                onCancel={() => setModalOpen(false)}
                categories={categories} // pass for dropdown
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

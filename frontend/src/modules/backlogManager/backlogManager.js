import React, { useEffect, useState } from 'react';
import BacklogList from './backlogList';
import BacklogForm from './backlogForm';
import {
  getBacklogItems,
  createBacklogItem,
  updateBacklogItem,
  deleteBacklogItem,
  moveBacklogItem
} from '../../api';

export default function BacklogManager() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const load = () => getBacklogItems().then(r => setItems(r.data));

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setModalOpen(true); };
  const openEdit = i => { setEditing(i); setModalOpen(true); };
  const handleDelete = id => {
    if (window.confirm('Delete this item?')) deleteBacklogItem(id).then(load);
  };
  const handleSave = data => {
    const action = editing ? updateBacklogItem(editing.id, data) : createBacklogItem(data);
    action.then(() => { setModalOpen(false); load(); });
  };
  const handleMove = (item, dir) => moveBacklogItem(item.id, dir).then(r => setItems(r.data));

  return (
    <div className="container">
      <h3>Backlog</h3>
      <button onClick={openNew} className="btn btn-primary mb-2">New Item</button>
      <BacklogList items={items} onEdit={openEdit} onDelete={handleDelete} onMove={handleMove} />
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalOpen(false)}>×</button>
            <BacklogForm existing={editing} onSave={handleSave} onCancel={() => setModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

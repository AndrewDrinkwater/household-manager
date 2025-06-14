import React from 'react';

export default function BacklogList({ items, onEdit, onDelete, onMove }) {
  const active = items.filter(i => i.status !== 'Done');
  const done = items.filter(i => i.status === 'Done');

  const renderTable = list => (
    <table className="fixed-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Category</th>
          <th>Priority</th>
          <th>Status</th>
          <th className="actions-col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {list.map((item, idx) => (
          <tr key={item.id}>
            <td>{item.title}</td>
            <td>{item.category}</td>
            <td>{item.priority}</td>
            <td>{item.status}</td>
            <td className="actions-col">
              <div className="action-buttons">
                <button className="btn btn-sm btn-secondary" onClick={() => onMove(item, 'up')} disabled={idx === 0}>↑</button>
                <button className="btn btn-sm btn-secondary" onClick={() => onMove(item, 'down')} disabled={idx === list.length-1}>↓</button>
                <button className="btn btn-sm btn-warning" onClick={() => onEdit(item)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(item.id)}>Delete</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      <h3>Active</h3>
      {renderTable(active)}
      <h3 style={{ marginTop: '2rem' }}>Done</h3>
      {renderTable(done)}
    </div>
  );
}

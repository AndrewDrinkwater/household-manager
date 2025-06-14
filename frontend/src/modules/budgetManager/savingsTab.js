import React, { useEffect, useState } from 'react';
import {
  getSavingPots,
  createSavingPot,
  deleteSavingPot,
  getSavingEntries
} from '../../api';

export default function SavingsTab() {
  const [pots, setPots] = useState([]);
  const [entries, setEntries] = useState([]);

  const loadPots = () => getSavingPots().then(r => setPots(r.data));
  const loadEntries = (id) => getSavingEntries(id).then(r => setEntries(r.data));

  useEffect(() => { loadPots(); }, []);

  const addPot = async () => {
    const name = prompt('Pot name');
    if (!name) return;
    await createSavingPot({ name });
    loadPots();
  };

  const removePot = async (id) => {
    if (!window.confirm('Delete?')) return;
    await deleteSavingPot(id);
    loadPots();
  };

  return (
    <div>
      <h3>Savings</h3>
      <button className="btn btn-primary mb-2" onClick={addPot}>Add Pot</button>
      <table className="fixed-table">
        <thead><tr><th>Name</th><th>Value</th><th>Actions</th></tr></thead>
        <tbody>
          {pots.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.current_value}</td>
              <td className="actions-col">
                <button className="btn btn-sm btn-secondary" onClick={() => loadEntries(p.id)}>Entries</button>
                <button className="btn btn-sm btn-danger" onClick={() => removePot(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {entries.length > 0 && (
        <div className="modal-backdrop" onClick={() => setEntries([])}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h4>Entries</h4>
            <ul>
              {entries.map(e => <li key={e.id}>{e.value}</li>)}
            </ul>
            <button className="btn btn-sm btn-primary" onClick={() => setEntries([])}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  getBudgetMonths,
  createBudgetMonth,
  updateBudgetMonth,
  deleteBudgetMonth,
  copyBudgetMonth,
  getBudgetLines,
  createBudgetLine,
  updateBudgetLine,
  deleteBudgetLine,
  getIncomeSources,
  createIncomeSource,
  updateIncomeSource,
  deleteIncomeSource,
  getSavingPots,
  createSavingPot,
  updateSavingPot,
  deleteSavingPot,
  getSavingEntries,
  createSavingEntry,
  updateSavingEntry,
  deleteSavingEntry
} from '../../api';

export default function BudgetManager() {
  const [months, setMonths] = useState([]);
  const [selected, setSelected] = useState(null);
  const [lines, setLines] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [pots, setPots] = useState([]);
  const [entries, setEntries] = useState([]);

  const loadMonths = () => getBudgetMonths().then(r => setMonths(r.data));

  useEffect(() => { loadMonths(); loadPots(); }, []);

  const loadDetails = (monthId) => {
    getBudgetLines(monthId).then(r => setLines(r.data));
    getIncomeSources(monthId).then(r => setIncomes(r.data));
    setSelected(monthId);
  };

  const loadPots = () => getSavingPots().then(r => setPots(r.data));
  const loadEntries = (potId) => getSavingEntries(potId).then(r => setEntries(r.data));

  const addMonth = async () => {
    const month = prompt('Enter month (YYYY-MM)');
    if (!month) return;
    await createBudgetMonth({ month });
    loadMonths();
  };

  const copyFromPrev = async (id) => {
    const prevId = prompt('Copy from month id?');
    if (!prevId) return;
    await copyBudgetMonth(id, prevId);
    loadDetails(id);
  };

  const togglePaid = async (line) => {
    await updateBudgetLine(line.id, { is_paid: !line.is_paid });
    loadDetails(selected);
  };

  return (
    <div>
      <h3>Budget Months</h3>
      <button className="btn btn-primary mb-2" onClick={addMonth}>New Month</button>
      <table className="fixed-table">
        <thead>
          <tr><th>Month</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {months.map(m => (
            <tr key={m.id}>
              <td>{m.month}</td>
              <td className="actions-col">
                <button className="btn btn-sm btn-secondary" onClick={() => loadDetails(m.id)}>Open</button>
                <button className="btn btn-sm btn-secondary" onClick={() => copyFromPrev(m.id)}>Copy</button>
                <button className="btn btn-sm btn-danger" onClick={() => { if(window.confirm('Delete?')) deleteBudgetMonth(m.id).then(loadMonths); }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h4>Month Details</h4>
            <table className="fixed-table">
              <thead><tr><th>Name</th><th>Planned</th><th>Actual</th><th>Paid</th></tr></thead>
              <tbody>
                {lines.map(line => (
                  <tr key={line.id} className={line.is_paid ? 'text-success' : ''}>
                    <td>{line.name}</td>
                    <td>{line.planned}</td>
                    <td>{line.actual}</td>
                    <td><input type="checkbox" checked={line.is_paid} onChange={() => togglePaid(line)} /></td>
                  </tr>
                ))}
                {lines.length === 0 && <tr><td colSpan="4">No lines</td></tr>}
              </tbody>
            </table>
            <h5>Income</h5>
            <table className="fixed-table">
              <thead><tr><th>Name</th><th>Amount</th></tr></thead>
              <tbody>
                {incomes.map(i => (
                  <tr key={i.id}><td>{i.name}</td><td>{i.amount}</td></tr>
                ))}
                {incomes.length === 0 && <tr><td colSpan="2">No income</td></tr>}
              </tbody>
            </table>
            <button className="btn btn-sm btn-primary mt-2" onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}

      <h3 style={{marginTop:'2rem'}}>Savings</h3>
      <button className="btn btn-primary mb-2" onClick={() => {
        const name = prompt('Pot name');
        if(name) createSavingPot({ name }).then(loadPots);
      }}>Add Pot</button>
      <table className="fixed-table">
        <thead><tr><th>Name</th><th>Value</th><th>Actions</th></tr></thead>
        <tbody>
          {pots.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.current_value}</td>
              <td className="actions-col">
                <button className="btn btn-sm btn-secondary" onClick={() => {loadEntries(p.id);}}>
                  Entries
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => { if(window.confirm('Delete?')) deleteSavingPot(p.id).then(loadPots); }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {entries.length > 0 && (
        <div className="modal-backdrop" onClick={() => setEntries([])}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
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

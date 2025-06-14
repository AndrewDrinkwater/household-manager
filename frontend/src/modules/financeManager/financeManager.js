import React, { useEffect, useState } from 'react';
import {
  getBudgetMonths,
  createBudgetMonth,
  updateBudgetEntry,
  createIncomeSource
} from '../../api';

function EntryRow({ entry }) {
  const [planned, setPlanned] = useState(entry.planned_amount);
  const [actual, setActual] = useState(entry.actual_amount || '');
  const [paid, setPaid] = useState(entry.is_paid);

  const save = () => {
    updateBudgetEntry(entry.id, {
      planned_amount: planned || 0,
      actual_amount: actual || null,
      is_paid: paid
    });
  };

  return (
    <tr>
      <td>{entry.BudgetLine.name}</td>
      <td>
        <input
          type="number"
          value={planned}
          onChange={e => setPlanned(e.target.value)}
          onBlur={save}
        />
      </td>
      <td>
        <input
          type="number"
          value={actual}
          onChange={e => setActual(e.target.value)}
          onBlur={save}
        />
      </td>
      <td>
        <input
          type="checkbox"
          checked={paid}
          onChange={e => { setPaid(e.target.checked); save(); }}
        />
      </td>
    </tr>
  );
}

function Month({ month }) {
  const incomeTotal = month.IncomeSources.reduce((s,i)=>s+parseFloat(i.amount||0),0);
  const plannedTotal = month.BudgetEntries.reduce((s,e)=>s+parseFloat(e.planned_amount||0),0);
  const remaining = incomeTotal - plannedTotal;

  const addIncome = () => {
    const name = prompt('Source name');
    const amt = prompt('Amount');
    if(!name||!amt)return;
    createIncomeSource({ name, amount: amt, BudgetMonthId: month.id });
  };

  return (
    <div style={{ border:'1px solid #ccc', padding:'1rem', marginBottom:'1rem' }}>
      <h4>{month.month}</h4>
      <div>Income: £{incomeTotal.toFixed(2)} | Outgoings: £{plannedTotal.toFixed(2)} | Remaining: £{remaining.toFixed(2)}</div>
      <button className="btn btn-sm btn-secondary" onClick={addIncome}>Add Income</button>
      <table className="fixed-table" style={{ marginTop:'0.5rem' }}>
        <thead>
          <tr>
            <th>Line</th><th>Planned</th><th>Actual</th><th>Paid</th>
          </tr>
        </thead>
        <tbody>
          {month.BudgetEntries.map(entry => <EntryRow key={entry.id} entry={entry} />)}
        </tbody>
      </table>
    </div>
  );
}

export default function FinanceManager() {
  const [months, setMonths] = useState([]);

  const load = () => getBudgetMonths().then(r => setMonths(r.data));

  useEffect(() => { load(); }, []);

  const addMonth = () => createBudgetMonth().then(load);

  return (
    <div className="container">
      <h3>Budget</h3>
      <button className="btn btn-primary mb-2" onClick={addMonth}>Add Month</button>
      {months.map(m => <Month key={m.id} month={m} />)}
    </div>
  );
}

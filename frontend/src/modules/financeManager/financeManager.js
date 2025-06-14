import React, { useEffect, useState } from 'react';
import {
  getBudgetMonths,
  createBudgetMonth,
  getBudgetLines,
  createBudgetLine,
  updateBudgetEntry,
  createBudgetEntry,
  createIncomeSource,
  updateIncomeSource
} from '../../api';

function EntryCell({ entry, monthId, lineId, reload }) {
  const [planned, setPlanned] = useState(entry ? entry.planned_amount : '');
  const [actual, setActual] = useState(entry ? entry.actual_amount || '' : '');
  const [paid, setPaid] = useState(entry ? entry.is_paid : false);

  useEffect(() => {
    setPlanned(entry ? entry.planned_amount : '');
    setActual(entry ? entry.actual_amount || '' : '');
    setPaid(entry ? entry.is_paid : false);
  }, [entry]);

  const save = () => {
    const data = {
      planned_amount: planned || 0,
      actual_amount: actual || null,
      is_paid: paid
    };
    if (entry) {
      updateBudgetEntry(entry.id, data).then(reload);
    } else {
      createBudgetEntry({ ...data, BudgetMonthId: monthId, BudgetLineId: lineId }).then(reload);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <input type="number" value={planned} onChange={e => setPlanned(e.target.value)} onBlur={save} style={{ marginBottom: '0.25rem' }} />
      <input type="number" value={actual} onChange={e => setActual(e.target.value)} onBlur={save} style={{ marginBottom: '0.25rem' }} />
      <input type="checkbox" checked={paid} onChange={e => { setPaid(e.target.checked); save(); }} />
    </div>
  );
}

function IncomeCell({ month, name, reload }) {
  const src = month.IncomeSources.find(i => i.name === name);
  const [amount, setAmount] = useState(src ? src.amount : '');

  useEffect(() => {
    setAmount(src ? src.amount : '');
  }, [src]);

  const save = () => {
    if (src) {
      updateIncomeSource(src.id, { amount: amount || 0 }).then(reload);
    } else if (amount) {
      createIncomeSource({ name, amount, BudgetMonthId: month.id }).then(reload);
    }
  };

  return (
    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} onBlur={save} style={{ marginBottom: 0 }} />
  );
}

export default function FinanceManager() {
  const [months, setMonths] = useState([]);
  const [lines, setLines] = useState([]);

  const load = () => {
    Promise.all([getBudgetMonths(), getBudgetLines()]).then(([m, l]) => {
      setMonths(m.data);
      setLines(l.data);
    });
  };

  useEffect(() => { load(); }, []);

  const addMonth = () => createBudgetMonth().then(load);

  const addLine = type => {
    const name = prompt('Line name');
    if (!name) return;
    createBudgetLine({ name, type }).then(res => {
      const line = res.data;
      Promise.all(months.map(m => createBudgetEntry({ BudgetMonthId: m.id, BudgetLineId: line.id }))).then(load);
    });
  };

  const addIncomeRow = () => {
    const name = prompt('Income source name');
    if (!name) return;
    Promise.all(months.map(m => createIncomeSource({ name, amount: 0, BudgetMonthId: m.id }))).then(load);
  };

  const incomeNames = Array.from(new Set(months.flatMap(m => m.IncomeSources.map(i => i.name))));
  const bills = lines.filter(l => l.type === 'BILL' && !l.is_retired);
  const variables = lines.filter(l => l.type === 'VARIABLE' && !l.is_retired);
  const annuals = lines.filter(l => l.type === 'ANNUAL' && !l.is_retired);

  return (
    <div className="container">
      <h3>Budget</h3>
      <button className="btn btn-primary mb-2" onClick={addMonth}>Add Month</button>
      <table className="fixed-table">
        <thead>
          <tr>
            <th>Line</th>
            {months.map(m => <th key={m.id}>{m.month}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th colSpan={months.length + 1}>Income <button className="btn btn-sm btn-secondary" onClick={addIncomeRow}>Add Income</button></th>
          </tr>
          {incomeNames.map(name => (
            <tr key={`inc-${name}`}>
              <td>{name}</td>
              {months.map(m => (
                <td key={m.id}><IncomeCell month={m} name={name} reload={load} /></td>
              ))}
            </tr>
          ))}
          <tr>
            <th colSpan={months.length + 1}>Bills <button className="btn btn-sm btn-secondary" onClick={() => addLine('BILL')}>Add Bill</button></th>
          </tr>
          {bills.map(line => (
            <tr key={line.id}>
              <td>{line.name}</td>
              {months.map(m => {
                const entry = m.BudgetEntries.find(e => e.BudgetLineId === line.id);
                return <td key={m.id}><EntryCell entry={entry} monthId={m.id} lineId={line.id} reload={load} /></td>;
              })}
            </tr>
          ))}
          <tr>
            <th colSpan={months.length + 1}>Variable <button className="btn btn-sm btn-secondary" onClick={() => addLine('VARIABLE')}>Add Variable</button></th>
          </tr>
          {variables.map(line => (
            <tr key={line.id}>
              <td>{line.name}</td>
              {months.map(m => {
                const entry = m.BudgetEntries.find(e => e.BudgetLineId === line.id);
                return <td key={m.id}><EntryCell entry={entry} monthId={m.id} lineId={line.id} reload={load} /></td>;
              })}
            </tr>
          ))}
          <tr>
            <th colSpan={months.length + 1}>Annual <button className="btn btn-sm btn-secondary" onClick={() => addLine('ANNUAL')}>Add Annual</button></th>
          </tr>
          {annuals.map(line => (
            <tr key={line.id}>
              <td>{line.name}</td>
              {months.map(m => {
                const entry = m.BudgetEntries.find(e => e.BudgetLineId === line.id);
                return <td key={m.id}><EntryCell entry={entry} monthId={m.id} lineId={line.id} reload={load} /></td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

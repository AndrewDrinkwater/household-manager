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

const fmt = val => new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
}).format(parseFloat(val || 0));

function EntryCell({ entry, monthId, lineId, reload }) {
  const [amount, setAmount] = useState(entry ? entry.planned_amount : 0);
  const [paid, setPaid] = useState(entry ? entry.is_paid : false);
  const [editing, setEditing] = useState(false);
  const clickTimeout = React.useRef(null);

  useEffect(() => {
    setAmount(entry ? entry.planned_amount : 0);
    setPaid(entry ? entry.is_paid : false);
  }, [entry]);

  const save = (updated = {}) => {
    const data = {
      planned_amount: updated.amount !== undefined ? updated.amount : amount || 0,
      is_paid: updated.paid !== undefined ? updated.paid : paid,
    };
    if (entry) {
      updateBudgetEntry(entry.id, data).then(reload);
    } else {
      createBudgetEntry({ ...data, BudgetMonthId: monthId, BudgetLineId: lineId }).then(reload);
    }
  };

  const handleClick = () => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }
    clickTimeout.current = setTimeout(() => {
      const newPaid = !paid;
      setPaid(newPaid);
      save({ paid: newPaid });
      clickTimeout.current = null;
    }, 200);
  };

  const handleDoubleClick = () => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    save({ amount });
  };


  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{ backgroundColor: paid ? 'var(--success)' : 'transparent', cursor: 'pointer', color: paid ? '#fff' : 'inherit' }}
    >
      {editing ? (
        <input
          type="number"
          value={amount}
          autoFocus
          onChange={e => setAmount(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleBlur();
            }
          }}
          style={{ width: '100%' }}
        />
      ) : (
        <span>{fmt(amount)}</span>
      )}
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

  const remainingFor = month => {
    const incomeTotal = month.IncomeSources.reduce((s, i) => s + parseFloat(i.amount || 0), 0);
    const expenseTotal = month.BudgetEntries.reduce((s, e) => {
      const line = lines.find(l => l.id === e.BudgetLineId);
      if (line && !line.is_retired) {
        s += parseFloat(e.planned_amount || 0);
      }
      return s;
    }, 0);
    return incomeTotal - expenseTotal;
  };

  return (
    <div className="container">
      <h3>Budget</h3>
      <button className="btn btn-primary mb-2" onClick={addMonth}>Add Month</button>
      <div style={{ overflowX: 'auto' }}>
      <table className="finance-table">
        <thead>
          <tr>
            <th className="line-name">Line</th>
            {months.map(m => <th className="month-col" key={m.id}>{m.month}</th>)}
          </tr>
          <tr className="remaining-row">
            <th className="line-name">Remaining</th>
            {months.map(m => (
              <th className="month-col" key={`rem-${m.id}`}>{fmt(remainingFor(m))}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="section-header">
            <th colSpan={months.length + 1}>Income <button className="btn btn-sm btn-secondary" onClick={addIncomeRow}>Add Income</button></th>
          </tr>
          {incomeNames.map(name => (
            <tr key={`inc-${name}`}>
              <td className="line-name">{name}</td>
              {months.map(m => (
                <td className="month-col" key={m.id}><IncomeCell month={m} name={name} reload={load} /></td>
              ))}
            </tr>
          ))}
          <tr className="section-header">
            <th colSpan={months.length + 1}>Bills <button className="btn btn-sm btn-secondary" onClick={() => addLine('BILL')}>Add Bill</button></th>
          </tr>
          {bills.map(line => (
            <tr key={line.id}>
              <td className="line-name">{line.name}</td>
              {months.map(m => {
                const entry = m.BudgetEntries.find(e => e.BudgetLineId === line.id);
                return <td className="month-col" key={m.id}><EntryCell entry={entry} monthId={m.id} lineId={line.id} reload={load} /></td>;
              })}
            </tr>
          ))}
          <tr className="section-header">
            <th colSpan={months.length + 1}>Variable <button className="btn btn-sm btn-secondary" onClick={() => addLine('VARIABLE')}>Add Variable</button></th>
          </tr>
          {variables.map(line => (
            <tr key={line.id}>
              <td className="line-name">{line.name}</td>
              {months.map(m => {
                const entry = m.BudgetEntries.find(e => e.BudgetLineId === line.id);
                return <td className="month-col" key={m.id}><EntryCell entry={entry} monthId={m.id} lineId={line.id} reload={load} /></td>;
              })}
            </tr>
          ))}
          <tr className="section-header">
            <th colSpan={months.length + 1}>Annual <button className="btn btn-sm btn-secondary" onClick={() => addLine('ANNUAL')}>Add Annual</button></th>
          </tr>
          {annuals.map(line => (
            <tr key={line.id}>
              <td className="line-name">{line.name}</td>
              {months.map(m => {
                const entry = m.BudgetEntries.find(e => e.BudgetLineId === line.id);
                return <td className="month-col" key={m.id}><EntryCell entry={entry} monthId={m.id} lineId={line.id} reload={load} /></td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

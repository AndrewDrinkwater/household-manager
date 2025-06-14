import React, { useEffect, useState } from 'react';
import {
  getBudgetMonths,
  createBudgetMonth,
  getBudgetLines,
  createBudgetLine,
  updateBudgetEntry,
  createBudgetEntry,
  updateBudgetLine,
  createIncomeSource,
  updateIncomeSource,
  copyBudgetMonth
} from '../../api';

const fmt = val => new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
}).format(parseFloat(val || 0));

function EntryCell({ entry, monthId, lineId, reload, disabled }) {
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


  if (disabled) {
    return <div className="disabled-cell">{fmt(amount)}</div>;
  }

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
  const copyMonth = () => copyBudgetMonth().then(load);

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

  const toggleLine = line => {
    updateBudgetLine(line.id, { is_retired: !line.is_retired }).then(load);
  };

  const incomeNames = Array.from(new Set(months.flatMap(m => m.IncomeSources.map(i => i.name))));
  const sortLines = arr => arr.slice().sort((a, b) => a.is_retired - b.is_retired);
  const bills = sortLines(lines.filter(l => l.type === 'BILL'));
  const variables = sortLines(lines.filter(l => l.type === 'VARIABLE'));
  const annuals = sortLines(lines.filter(l => l.type === 'ANNUAL'));

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
      <button className="btn btn-secondary mb-2" style={{ marginLeft: '0.5rem' }} onClick={copyMonth}>Copy Month</button>
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
            <th colSpan={months.length + 1}>Income <button className="btn btn-sm btn-secondary add-action" onClick={addIncomeRow}>Add Income</button></th>
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
            <th colSpan={months.length + 1}>Bills <button className="btn btn-sm btn-secondary add-action" onClick={() => addLine('BILL')}>Add Bill</button></th>
          </tr>
          {bills.map(line => (
            <tr key={line.id} className={line.is_retired ? 'retired-line' : ''}>
              <td className="line-name">
                {line.name}
                <button className="line-toggle" onClick={() => toggleLine(line)}>{line.is_retired ? '✔' : '✖'}</button>
              </td>
              {months.map(m => {
                const entry = m.BudgetEntries.find(e => e.BudgetLineId === line.id);
                return <td className="month-col" key={m.id}><EntryCell entry={entry} monthId={m.id} lineId={line.id} reload={load} disabled={line.is_retired && (!entry || parseFloat(entry.planned_amount) === 0)} /></td>;
              })}
            </tr>
          ))}
          <tr className="section-header">
            <th colSpan={months.length + 1}>Variables <button className="btn btn-sm btn-secondary add-action" onClick={() => addLine('VARIABLE')}>Add Variable</button></th>
          </tr>
          {variables.map(line => (
            <tr key={line.id} className={line.is_retired ? 'retired-line' : ''}>
              <td className="line-name">
                {line.name}
                <button className="line-toggle" onClick={() => toggleLine(line)}>{line.is_retired ? '✔' : '✖'}</button>
              </td>
              {months.map(m => {
                const entry = m.BudgetEntries.find(e => e.BudgetLineId === line.id);
                return <td className="month-col" key={m.id}><EntryCell entry={entry} monthId={m.id} lineId={line.id} reload={load} disabled={line.is_retired && (!entry || parseFloat(entry.planned_amount) === 0)} /></td>;
              })}
            </tr>
          ))}
          <tr className="section-header">
            <th colSpan={months.length + 1}>Annuals <button className="btn btn-sm btn-secondary add-action" onClick={() => addLine('ANNUAL')}>Add Annual</button></th>
          </tr>
          {annuals.map(line => (
            <tr key={line.id} className={line.is_retired ? 'retired-line' : ''}>
              <td className="line-name">
                {line.name}
                <button className="line-toggle" onClick={() => toggleLine(line)}>{line.is_retired ? '✔' : '✖'}</button>
              </td>
              {months.map(m => {
                const entry = m.BudgetEntries.find(e => e.BudgetLineId === line.id);
                return <td className="month-col" key={m.id}><EntryCell entry={entry} monthId={m.id} lineId={line.id} reload={load} disabled={line.is_retired && (!entry || parseFloat(entry.planned_amount) === 0)} /></td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

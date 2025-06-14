import React, { useEffect, useState } from 'react';
import {
  getBudgetMonths,
  createBudgetMonth,
  getBudgetLines,
  createBudgetLine,
  updateBudgetLine,
  copyBudgetMonth
} from '../../api';

export default function BudgetGrid() {
  const [months, setMonths] = useState([]);
  const [linesByMonth, setLinesByMonth] = useState({});

  const load = async () => {
    const mRes = await getBudgetMonths();
    const ms = mRes.data;
    setMonths(ms);
    const all = {};
    for (const m of ms) {
      const res = await getBudgetLines(m.id);
      all[m.id] = res.data;
    }
    setLinesByMonth(all);
  };

  useEffect(() => { load(); }, []);

  const addMonth = async () => {
    const month = prompt('Enter month (YYYY-MM)');
    if (!month) return;
    await createBudgetMonth({ month });
    load();
  };

  const copyMonth = async (id) => {
    const fromId = prompt('Copy from month id?');
    if (!fromId) return;
    await copyBudgetMonth(id, fromId);
    load();
  };

  const addLine = async (monthId) => {
    const name = prompt('Line name');
    if (!name) return;
    const category = prompt('Category (Income/Bill/Variable/Annual)', 'Bill');
    const planned = parseFloat(prompt('Planned amount', '0')) || 0;
    await createBudgetLine(monthId, { name, category, planned });
    load();
  };

  const togglePaid = async (line) => {
    await updateBudgetLine(line.id, { is_paid: !line.is_paid });
    load();
  };

  const updateAmount = async (line) => {
    const val = prompt('Planned amount', line.planned);
    if (val === null) return;
    await updateBudgetLine(line.id, { planned: parseFloat(val) || 0 });
    load();
  };

  const disableLine = async (line) => {
    await updateBudgetLine(line.id, { is_retired: !line.is_retired });
    load();
  };

  const allLines = Array.from(
    new Set(
      Object.values(linesByMonth)
        .flat()
        .map(l => l.name)
    )
  );
  const categories = ['Income', 'Bill', 'Variable', 'Annual'];

  const rowsByCategory = {};
  categories.forEach(c => rowsByCategory[c] = []);
  allLines.forEach(name => {
    for (const m of months) {
      const line = (linesByMonth[m.id] || []).find(l => l.name === name);
      if (line) {
        rowsByCategory[line.category] = rowsByCategory[line.category] || [];
        if (!rowsByCategory[line.category].includes(name)) rowsByCategory[line.category].push(name);
        break;
      }
    }
  });

  return (
    <div>
      <div className="mb-2">
        <button className="btn btn-primary" onClick={addMonth}>Add Month</button>
      </div>
      {categories.map(cat => (
        <div key={cat} style={{marginBottom:'2rem'}}>
          <h4>{cat}</h4>
          <table className="fixed-table budget-grid">
            <thead>
              <tr>
                <th>Line Item</th>
                {months.map(m => (
                  <th key={m.id}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <span>{m.month}</span>
                      <span>
                        <button className="btn btn-sm btn-secondary" onClick={() => addLine(m.id)}>+</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => copyMonth(m.id)}>⤵︎</button>
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowsByCategory[cat].map(name => (
                <tr key={name}>
                  <td>{name}</td>
                  {months.map(m => {
                    const line = (linesByMonth[m.id] || []).find(l => l.name === name);
                    if (!line) return <td key={m.id}></td>;
                    return (
                      <td
                        key={m.id}
                        className={line.is_paid ? 'paid-cell' : ''}
                        onClick={() => togglePaid(line)}
                        onDoubleClick={() => updateAmount(line)}
                      >
                        {line.planned}
                        <button
                          className="btn btn-sm btn-warning"
                          style={{marginLeft:'0.25rem'}}
                          onClick={(e) => { e.stopPropagation(); disableLine(line); }}
                        >
                          {line.is_retired ? 'Enable' : 'Disable'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

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
  const [editing, setEditing] = useState(null); // {monthId, name, value}

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
    let month;
    if (months.length === 0) {
      const now = new Date();
      month = now.toISOString().slice(0, 7);
    } else {
      const last = months[months.length - 1].month;
      const [y, m] = last.split('-').map(Number);
      const d = new Date(y, m - 1, 1);
      d.setMonth(d.getMonth() + 1);
      month = d.toISOString().slice(0, 7);
    }
    const res = await createBudgetMonth({ month });
    if (months.length > 0) {
      const prevId = months[months.length - 1].id;
      await copyBudgetMonth(res.data.id, prevId);
    }
    load();
  };


  const addLine = async () => {
    if (months.length === 0) return;
    const monthId = months[months.length - 1].id;
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


  const toggleRetired = async (name) => {
    for (const m of months) {
      const line = (linesByMonth[m.id] || []).find(l => l.name === name);
      if (line) {
        await updateBudgetLine(line.id, { is_retired: !line.is_retired });
      }
    }
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

  const totalsByCategory = {};
  const totals = {};
  categories.forEach(c => {
    totalsByCategory[c] = {};
    months.forEach(m => { totalsByCategory[c][m.id] = 0; });
  });
  months.forEach(m => {
    totals[m.id] = { income: 0, out: 0 };
    (linesByMonth[m.id] || []).forEach(l => {
      totalsByCategory[l.category][m.id] += l.planned;
      if (l.category === 'Income') totals[m.id].income += l.planned;
      else totals[m.id].out += l.planned;
    });
  });

  const balClass = (v) => {
    if (v < 0) return 'red';
    if (v < 300) return 'yellow';
    if (v < 1000) return 'dark-green';
    return 'green';
  };

  return (
    <div>
      <div className="mb-2" style={{display:'flex', gap:'0.5rem'}}>
        <button className="btn btn-primary" onClick={addMonth}>Add Month</button>
        <button className="btn btn-secondary" onClick={addLine}>Add Line</button>
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
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                      <span>{m.month}</span>
                      <span className={`balance ${balClass(totals[m.id].income - totals[m.id].out)}`}>{(totals[m.id].income - totals[m.id].out).toFixed(2)}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowsByCategory[cat].sort((a,b) => {
                const la = Object.values(linesByMonth).flat().find(l => l.name===a);
                const lb = Object.values(linesByMonth).flat().find(l => l.name===b);
                return (la?.is_retired?1:0)-(lb?.is_retired?1:0);
              }).map(name => (
                <tr key={name} className={Object.values(linesByMonth).flat().find(l=>l.name===name)?.is_retired ? 'retired' : ''}>
                  <td>
                    {name}
                    <button className="icon-btn" onClick={() => toggleRetired(name)}>🚫</button>
                  </td>
                  {months.map(m => {
                    const line = (linesByMonth[m.id] || []).find(l => l.name === name);
                    const isEditing = editing && editing.monthId===m.id && editing.name===name;
                    if (isEditing) {
                      return (
                        <td key={m.id}>
                          <input
                            type="number"
                            value={editing.value}
                            onChange={e => setEditing({...editing, value:e.target.value})}
                            onBlur={async () => {
                              const val = parseFloat(editing.value)||0;
                              if (line) await updateBudgetLine(line.id, { planned: val });
                              else {
                                const other = Object.values(linesByMonth).flat().find(l=>l.name===name);
                                const cat = other ? other.category : 'Bill';
                                await createBudgetLine(m.id, { name, category: cat, planned: val });
                              }
                              setEditing(null);
                              load();
                            }}
                          />
                        </td>
                      );
                    }
                    return (
                      <td
                        key={m.id}
                        className={line && line.is_paid ? 'paid-cell' : ''}
                        onClick={() => line && togglePaid(line)}
                        onDoubleClick={() => setEditing({monthId:m.id,name,value:line?line.planned:''})}
                      >
                        {line ? line.planned : ''}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="total-row">
                <td>Total</td>
                {months.map(m => (
                  <td key={m.id}>{totalsByCategory[cat][m.id].toFixed(2)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

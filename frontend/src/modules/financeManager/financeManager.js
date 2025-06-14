import React, { useEffect, useState } from 'react';
import { getBudgetMonths, createNextBudgetMonth } from '../../api';

export default function FinanceManager() {
  const [months, setMonths] = useState([]);

  const loadMonths = () => {
    getBudgetMonths().then(res => setMonths(res.data));
  };

  useEffect(() => {
    loadMonths();
  }, []);

  const addMonth = () => {
    createNextBudgetMonth().then(loadMonths);
  };

  return (
    <div className="container">
      <h3>Finance</h3>
      <button onClick={addMonth} className="btn btn-primary mb-2">Add Month</button>
      <ul>
        {months.map(m => (
          <li key={m.id}>{m.month}</li>
        ))}
      </ul>
    </div>
  );
}

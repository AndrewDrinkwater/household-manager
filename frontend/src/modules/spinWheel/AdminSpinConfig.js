import React, { useEffect, useState } from 'react';
import { getSpinConfig, saveSpinConfig } from '../../api';

export default function AdminSpinConfig() {
  const [segments, setSegments] = useState([]);

  const load = () => getSpinConfig().then(res => setSegments(res.data));

  useEffect(() => { load(); }, []);

  const handleChange = (idx, field, value) => {
    const updated = [...segments];
    updated[idx] = { ...updated[idx], [field]: value };
    setSegments(updated);
  };

  const addRow = () => setSegments([...segments, { label: '', type: '', weight: 1 }]);

  const save = () => saveSpinConfig(segments).then(load);

  return (
    <div className="container">
      <h3>Spin Config</h3>
      <table>
        <thead><tr><th>Label</th><th>Type</th><th>Weight</th></tr></thead>
        <tbody>
          {segments.map((s,i) => (
            <tr key={i}>
              <td><input value={s.label} onChange={e=>handleChange(i,'label',e.target.value)} /></td>
              <td><input value={s.type} onChange={e=>handleChange(i,'type',e.target.value)} /></td>
              <td><input type="number" value={s.weight} onChange={e=>handleChange(i,'weight',parseInt(e.target.value,10)||0)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-secondary" onClick={addRow}>Add</button>
      <button className="btn btn-primary" onClick={save} style={{marginLeft:'0.5rem'}}>Save</button>
    </div>
  );
}

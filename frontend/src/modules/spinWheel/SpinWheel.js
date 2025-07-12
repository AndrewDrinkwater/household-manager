import React, { useEffect, useState } from 'react';
import { getSpinConfig, spin } from '../../api';
import './spinWheel.css';

export default function SpinWheel() {
  const [segments, setSegments] = useState([]);
  const [result, setResult] = useState(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    getSpinConfig().then(res => setSegments(res.data));
  }, []);

  const handleSpin = async () => {
    if (spinning) return;
    setSpinning(true);
    try {
      const res = await spin();
      setTimeout(() => {
        setResult(res.data);
        setSpinning(false);
      }, 1500);
    } catch (err) {
      setResult({ error: err.response?.data?.error || 'Spin failed' });
      setSpinning(false);
    }
  };

  const rotation = spinning ? { transform: 'rotate(720deg)' } : {};

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="wheel" style={rotation}>
        {segments.map(s => (
          <div key={s.id} className="segment">{s.label}</div>
        ))}
      </div>
      <button className="btn btn-primary" onClick={handleSpin} disabled={spinning}>Spin</button>
      {result && (
        <div style={{ marginTop: '1rem' }}>
          {result.error ? result.error : `You won: ${result.label}`}
        </div>
      )}
    </div>
  );
}

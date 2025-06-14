import React, { useState, useEffect } from 'react';

export default function RecordForm({ existing, onSave, onCancel, fields }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (existing) setFormData(existing);
    else {
      const initData = {};
      fields.forEach(f => {
        initData[f.name] = f.type === 'date' ? '' : '';
      });
      setFormData(initData);
    }
  }, [existing, fields]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map(({ name, label, type, required, options }) => (
        <div className="form-group mb-2" key={name}>
          <label>{label}</label>

          {type === 'select' ? (
            <select
              name={name}
              value={formData[name] || ''}
              onChange={handleChange}
              className="form-control"
              required={required}
            >
              <option value="" disabled>
                -- Select {label} --
              </option>
              {options && options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              name={name}
              value={formData[name] || ''}
              onChange={handleChange}
              className="form-control"
              required={required}
            />
          )}
        </div>
      ))}

      <div className="d-flex justify-content-end mt-3">
        <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  );
}

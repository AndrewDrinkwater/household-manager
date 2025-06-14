import React, { useState, useEffect } from 'react';

export default function CarForm({ existing, onSave, onCancel }) {
  const [car, setCar] = useState(
    existing || { make: '', model: '', year: '', registration: '', value: '', notes: '' }
  );

  useEffect(() => {
    if (existing) setCar(existing);
  }, [existing]);

  const handleChange = e => {
    const { name, value } = e.target;
    setCar(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(car);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Make</label>
        <input
          className="form-control"
          name="make"
          value={car.make}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Model</label>
        <input
          className="form-control"
          name="model"
          value={car.model}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Year</label>
        <input
          className="form-control"
          name="year"
          type="number"
          value={car.year || ''}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Registration</label>
        <input
          className="form-control"
          name="registration"
          value={car.registration}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Value (£)</label>
        <input
          className="form-control"
          name="value"
          type="number"
          step="0.01"
          value={car.value || ''}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          className="form-control"
          name="notes"
          value={car.notes}
          onChange={handleChange}
        />
      </div>

      <div className="d-flex justify-content-end mt-3">
        <button type="button" className="btn btn-secondary mr-2" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {existing ? 'Update' : 'Add'} Car
        </button>
      </div>
    </form>
  );
}

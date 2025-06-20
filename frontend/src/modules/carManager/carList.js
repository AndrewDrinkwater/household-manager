// src/modules/carManager/carList.js
import React from 'react';

export default function CarList({ cars, onSelectCar, selectedCarId }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {cars.length === 0 ? (
        <p>No cars found.</p>
      ) : (
        cars.map(car => {
          const isSelected = car.id === selectedCarId;
          const isRetired = car.status === 'Retired';
          return (
            <div
              key={car.id}
              onClick={() => onSelectCar(car)}
              style={{
                cursor: 'pointer',
                backgroundColor: isSelected ? 'var(--blue-mid)' : 'var(--blue-dark)',
                padding: '1rem 1.5rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'var(--text-light)',
                boxShadow: isSelected ? '0 0 10px var(--accent)' : 'none',
                transition: 'background-color 0.3s ease',
                opacity: isRetired ? 0.5 : 1,
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = isSelected ? 'var(--blue-mid)' : 'var(--blue-light)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = isSelected ? 'var(--blue-mid)' : 'var(--blue-dark)'}
            >
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                  {car.make} {car.model} ({car.registration || '-'})
                </div>
                <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  Status: {car.status || 'Active'}
                </div>
                <div style={{ fontSize: '0.9rem', marginTop: '0.3rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div>
                    <strong>Tax Due:</strong>{' '}
                    {car.nextTaxDue
                      ? new Date(car.nextTaxDue).toLocaleDateString('en-GB')
                      : 'No Data Available'}
                  </div>
                  <div>
                    <strong>Insurance Due:</strong>{' '}
                    {car.nextInsuranceDue
                      ? new Date(car.nextInsuranceDue).toLocaleDateString('en-GB')
                      : 'No Data Available'}
                  </div>
                  <div>
                    <strong>MOT Due:</strong>{' '}
                    {car.nextMotDue
                      ? new Date(car.nextMotDue).toLocaleDateString('en-GB')
                      : 'No Data Available'}
                  </div>
                  <div>
                    <strong>Service Due:</strong>{' '}
                    {car.nextServiceDue
                      ? new Date(car.nextServiceDue).toLocaleDateString('en-GB')
                      : 'No Data Available'}
                  </div>
                </div>
              </div>
              <button
                className="btn btn-warning btn-sm"
                onClick={e => {
                  e.stopPropagation(); // prevent selecting car when clicking edit
                  // Call a prop handler for edit, or use onSelectCar(car)
                  onSelectCar(car, true); // optional second param to indicate edit mode
                }}
              >
                Edit
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}

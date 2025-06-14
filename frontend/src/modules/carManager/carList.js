// src/modules/carManager/carList.js
import React, { useEffect, useState } from 'react';
import { getCars } from '../../api';

export default function CarList({ onSelectCar, selectedCarId }) {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    getCars().then(res => setCars(res.data));
  }, []);

  return (
    <div>
      <h3>Cars</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {cars.map(car => (
          <li
            key={car.id}
            onClick={() => onSelectCar(car.id)}
            style={{
              padding: '0.5rem',
              cursor: 'pointer',
              backgroundColor: car.id === selectedCarId ? '#ddd' : 'transparent',
              borderRadius: '4px',
              marginBottom: '0.25rem'
            }}
          >
            {car.make} {car.model} ({car.registration || 'No reg'})
          </li>
        ))}
      </ul>
    </div>
  );
}

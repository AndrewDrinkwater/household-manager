// src/modules/carManager/carManager.js
import React, { useState } from 'react';
import CarList from './carList';
import CarDetails from './carDetails';

export default function CarManager() {
  const [selectedCarId, setSelectedCarId] = useState(null);

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <div style={{ flex: 1 }}>
        <CarList onSelectCar={setSelectedCarId} selectedCarId={selectedCarId} />
      </div>
      <div style={{ flex: 2 }}>
        {selectedCarId ? (
          <CarDetails carId={selectedCarId} />
        ) : (
          <p>Select a car to see details</p>
        )}
      </div>
    </div>
  );
}

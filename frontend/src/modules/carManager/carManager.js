import React, { useState, useEffect } from 'react';
import CarList from './carList';
import CarDetails from './carDetails';
import CarForm from './carForm';
import { getCars, createCar, updateCar } from '../../api';

export default function CarManager() {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [carFormOpen, setCarFormOpen] = useState(false);
  const [carToEdit, setCarToEdit] = useState(null);

  // Load cars from backend
  const loadCars = () => {
    getCars()
      .then(res => setCars(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    loadCars();
  }, []);

  const openAddForm = () => {
    setCarToEdit(null);
    setCarFormOpen(true);
  };

  const openEditForm = (car) => {
    setCarToEdit(car);
    setCarFormOpen(true);
  };

  const closeCarForm = () => setCarFormOpen(false);

  const saveCar = (carData) => {
    const sanitized = {
      make: carData.make,
      model: carData.model,
      year: carData.year ? parseInt(carData.year, 10) : null,
      registration: carData.registration,
      value: carData.value ? parseFloat(carData.value) : null,
      notes: carData.notes,
    };
    const action = carToEdit ? updateCar(carToEdit.id, sanitized) : createCar(sanitized);
    action.then(() => {
      setCarFormOpen(false);
      loadCars();
    }).catch(console.error);
  };

  const openCarDetails = (car) => setSelectedCar(car);
  const closeCarDetails = () => setSelectedCar(null);

  return (
    <>
      <div className="mb-3">
        <button className="btn btn-primary" onClick={openAddForm}>
          Add New Car
        </button>
      </div>

      <CarList
        cars={cars}
        onSelectCar={openCarDetails}
        onEditCar={openEditForm}
      />

      {/* Car Add/Edit Form Modal */}
      {carFormOpen && (
        <div className="modal-backdrop" onClick={closeCarForm}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <CarForm
              existing={carToEdit}
              onSave={saveCar}
              onCancel={closeCarForm}
            />
          </div>
        </div>
      )}

      {/* Car Details Modal */}
      {selectedCar && (
        <div className="modal-backdrop" onClick={closeCarDetails}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <CarDetails car={selectedCar} onClose={closeCarDetails} />
          </div>
        </div>
      )}
    </>
  );
}

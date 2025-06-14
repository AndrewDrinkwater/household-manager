export default function CarList({ cars, onSelectCar, onEditCar }) {
  return (
    <div>
      <h3>Cars</h3>
      {cars.length === 0 && <p>No cars found.</p>}
      <ul className="list-group">
        {cars.map(car => (
          <li
            key={car.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span
              className="car-list-item"
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectCar(car)}
            >
              {car.make} {car.model} ({car.registration || 'No reg'})
            </span>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => onEditCar(car)}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

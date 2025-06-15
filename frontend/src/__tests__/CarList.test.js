import { render, screen, fireEvent } from '@testing-library/react';
import CarList from '../modules/carManager/carList';

test('shows message when no cars', () => {
  render(<CarList cars={[]} onSelectCar={() => {}} selectedCarId={null} />);
  expect(screen.getByText(/no cars found/i)).toBeInTheDocument();
});

test('calls onSelectCar when a car is clicked', () => {
  const car = { id: 1, make: 'Ford', model: 'Fiesta', registration: '', status: 'Active' };
  const handler = jest.fn();
  render(<CarList cars={[car]} onSelectCar={handler} selectedCarId={null} />);
  fireEvent.click(screen.getByText('Ford Fiesta (-)').closest('div'));
  expect(handler).toHaveBeenCalledWith(car);
});

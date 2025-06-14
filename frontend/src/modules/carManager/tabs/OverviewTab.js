export default function OverviewTab({ car }) {
  if (!car) return null;

  const nextTaxDue = car.nextTaxDue ? new Date(car.nextTaxDue).toLocaleDateString() : '-';
  const insuranceRenewal = car.nextInsuranceDue ? new Date(car.nextInsuranceDue).toLocaleDateString() : '-';
  const insuranceProvider = car.insuranceProviderName || '-';
  const serviceDueDate = car.nextServiceDue ? new Date(car.nextServiceDue).toLocaleDateString() : '-';
  const serviceType = car.serviceType || '-';
  const lastMileage = car.lastMileage || '-';

  return (
    <div className="modal-content p-2 mb-2" style={{ maxWidth: 'none' }}>
      <h2>{car.make} {car.model} ({car.registration})</h2>
      <p><strong>Next Tax Due:</strong> {nextTaxDue}</p>
      <p><strong>Insurance Renewal:</strong> {insuranceRenewal}</p>
      <p><strong>Insurance Provider:</strong> {insuranceProvider}</p>
      <p><strong>Service Due Date:</strong> {serviceDueDate}</p>
      <p><strong>Next Service Type:</strong> {serviceType}</p>
      <p><strong>Last Recorded Mileage:</strong> {lastMileage}</p>
    </div>
  );
}

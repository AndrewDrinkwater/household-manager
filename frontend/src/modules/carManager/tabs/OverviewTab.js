export default function OverviewTab({ car }) {
  if (!car) return null;

  const nextTaxDue = car.nextTaxDue
    ? new Date(car.nextTaxDue).toLocaleDateString('en-GB')
    : 'No Data Available';
  const insuranceRenewal = car.nextInsuranceDue
    ? new Date(car.nextInsuranceDue).toLocaleDateString('en-GB')
    : 'No Data Available';
  const nextMotDue = car.nextMotDue
    ? new Date(car.nextMotDue).toLocaleDateString('en-GB')
    : 'No Data Available';
  const insuranceProvider = car.insuranceProviderName || 'No Data Available';
  const serviceDueDate = car.nextServiceDue
    ? new Date(car.nextServiceDue).toLocaleDateString('en-GB')
    : 'No Data Available';
  const serviceType = car.serviceType || 'No Data Available';
  const lastMileage = car.lastMileage || 'No Data Available';

  return (
    <div className="modal-content p-2 mb-2" style={{ maxWidth: 'none' }}>
      <h2>{car.make} {car.model} ({car.registration})</h2>
      <p><strong>Next Tax Due:</strong> {nextTaxDue}</p>
      <p><strong>Insurance Renewal:</strong> {insuranceRenewal}</p>
      <p><strong>Insurance Provider:</strong> {insuranceProvider}</p>
      <p><strong>Next MOT Due:</strong> {nextMotDue}</p>
      <p><strong>Service Due Date:</strong> {serviceDueDate}</p>
      <p><strong>Next Service Type:</strong> {serviceType}</p>
      <p><strong>Last Recorded Mileage:</strong> {lastMileage}</p>
    </div>
  );
}

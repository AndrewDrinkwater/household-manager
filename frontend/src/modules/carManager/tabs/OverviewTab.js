export default function OverviewTab({ car }) {
  if (!car) return null;

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('en-GB') : 'No Data Available';

  const getStatusClass = (date) => {
    if (!date) return 'pill';
    const today = new Date();
    const target = new Date(date);
    const diffDays = (target - today) / (1000 * 60 * 60 * 24);

    if (diffDays > 183) return 'pill green';      // > 6 months
    if (diffDays > 90)  return 'pill yellow';     // 6 - 3 months
    if (diffDays > 30)  return 'pill amber';      // 3 - 1 month
    return 'pill red';                            // < 1 month or past
  };

  const insuranceProvider = car.insuranceProviderName || 'No Data Available';
  const serviceType = car.serviceType || 'No Data Available';
  const lastMileage = car.lastMileage || 'No Data Available';

  return (
    <div className="modal-content p-2 mb-2" style={{ maxWidth: 'none' }}>
      <h2>{car.make} {car.model} ({car.registration})</h2>
      <div className="dashboard-grid">
        <div className={getStatusClass(car.nextTaxDue)}>
          <strong>Next Tax Due</strong>
          <span>{formatDate(car.nextTaxDue)}</span>
        </div>
        <div className={getStatusClass(car.nextInsuranceDue)}>
          <strong>Insurance Renewal</strong>
          <span>{formatDate(car.nextInsuranceDue)}</span>
        </div>
        <div className="pill">
          <strong>Insurance Provider</strong>
          <span>{insuranceProvider}</span>
        </div>
        <div className={getStatusClass(car.nextMotDue)}>
          <strong>Next MOT Due</strong>
          <span>{formatDate(car.nextMotDue)}</span>
        </div>
        <div className={getStatusClass(car.nextServiceDue)}>
          <strong>Service Due Date</strong>
          <span>{formatDate(car.nextServiceDue)}</span>
        </div>
        <div className="pill">
          <strong>Next Service Type</strong>
          <span>{serviceType}</span>
        </div>
        <div className="pill">
          <strong>Last Recorded Mileage</strong>
          <span>{lastMileage}</span>
        </div>
      </div>
    </div>
  );
}

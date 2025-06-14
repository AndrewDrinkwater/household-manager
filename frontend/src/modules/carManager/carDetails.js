// src/modules/carManager/carDetails.js
import React, { useEffect, useState } from 'react';
import { getCar, getMots, getInsurances, getServiceRecords, getCarTaxes, getMileageRecords, getVendors } from '../../api';

export default function CarDetails({ carId }) {
  const [car, setCar] = useState(null);
  const [mot, setMot] = useState(null);
  const [insurance, setInsurance] = useState(null);
  const [serviceRecord, setServiceRecord] = useState(null);
  const [carTax, setCarTax] = useState(null);
  const [lastMileage, setLastMileage] = useState(null);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    if (!carId) return;

    getCar(carId).then(res => setCar(res.data));

    // Load latest MOT (latest expiryDate)
    getMots(carId).then(res => {
      if (res.data.length) {
        const latestMot = res.data.reduce((latest, curr) =>
          new Date(curr.expiryDate) > new Date(latest.expiryDate) ? curr : latest
        );
        setMot(latestMot);
      } else setMot(null);
    });

    // Load latest Insurance (by expiryDate)
    getInsurances(carId).then(res => {
      if (res.data.length) {
        const latestIns = res.data.reduce((latest, curr) =>
          new Date(curr.expiryDate) > new Date(latest.expiryDate) ? curr : latest
        );
        setInsurance(latestIns);
      } else setInsurance(null);
    });

    // Load latest ServiceRecord (by serviceDate)
    getServiceRecords(carId).then(res => {
      if (res.data.length) {
        const latestService = res.data.reduce((latest, curr) =>
          new Date(curr.serviceDate) > new Date(latest.serviceDate) ? curr : latest
        );
        setServiceRecord(latestService);
      } else setServiceRecord(null);
    });

    // Load latest CarTax (by expiryDate)
    getCarTaxes(carId).then(res => {
      if (res.data.length) {
        const latestTax = res.data.reduce((latest, curr) =>
          new Date(curr.expiryDate) > new Date(latest.expiryDate) ? curr : latest
        );
        setCarTax(latestTax);
      } else setCarTax(null);
    });

    // Load last MileageRecord (by recordDate)
    getMileageRecords(carId).then(res => {
      if (res.data.length) {
        const latestMileage = res.data.reduce((latest, curr) =>
          new Date(curr.recordDate) > new Date(latest.recordDate) ? curr : latest
        );
        setLastMileage(latestMileage);
      } else setLastMileage(null);
    });

    // Load Vendors for Insurance Provider name
    getVendors().then(res => setVendors(res.data));

  }, [carId]);

  // Helper to find Vendor name by id
  const findVendorName = (id) => {
    const v = vendors.find(v => v.id === id);
    return v ? v.name : 'Unknown';
  };

  // Infer next due dates as one year after latest record date
  const addOneYear = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().slice(0, 10);
  };

  // Infer next Service type alternating Full/Partial
  const inferNextServiceType = () => {
    if (!serviceRecord) return 'Full';
    return serviceRecord.serviceType === 'Full' ? 'Partial' : 'Full';
  };

  if (!car) return <p>Loading car details...</p>;

  return (
    <div>
      <h2>{car.make} {car.model} ({car.registration || 'No registration'})</h2>
      <p><strong>Year:</strong> {car.year || 'N/A'}</p>
      <p><strong>Value:</strong> {car.value ? `£${car.value}` : 'N/A'}</p>
      <p><strong>Notes:</strong> {car.notes || 'None'}</p>

      <h3>Overview</h3>
      <ul>
        <li><strong>Next Tax Due Date:</strong> {addOneYear(carTax?.expiryDate)}</li>
        <li><strong>Insurance Renewal Date:</strong> {addOneYear(insurance?.expiryDate)}</li>
        <li><strong>Insurance Provider:</strong> {insurance ? findVendorName(insurance.provider) : 'N/A'}</li>
        <li><strong>Service Due Date:</strong> {addOneYear(serviceRecord?.serviceDate)}</li>
        <li><strong>Next Service Type:</strong> {inferNextServiceType()}</li>
        <li><strong>Last Recorded Mileage:</strong> {lastMileage ? lastMileage.mileage : 'N/A'}</li>
      </ul>

      {/* TODO: add detailed sections for each (MOT, Insurance, etc) */}
    </div>
  );
}

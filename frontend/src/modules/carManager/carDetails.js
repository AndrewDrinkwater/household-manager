import React, { useState, useEffect } from 'react';
import { getCar, deleteCar, updateCar } from '../../api';
import OverviewTab from './tabs/OverviewTab';
import MotTab from './tabs/MotTab';
import InsuranceTab from './tabs/InsuranceTab';
import ServiceTab from './tabs/ServiceTab';
import TaxTab from './tabs/TaxTab';
import MileageTab from './tabs/MileageTab';

export default function CarDetails({ carId, onClose, onCarsUpdated }) {
  const [activeTab, setActiveTab] = useState('mot'); // Default to first actual tab
  const [car, setCar] = useState(null);

  const loadCar = () => {
    getCar(carId)
      .then(res => setCar(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    if (carId) loadCar();
  }, [carId]);

  if (!car) return <div style={styles.overlay}><div style={styles.container}>Loading...</div></div>;

  const handleRecordsChange = () => {
    loadCar();
    if (onCarsUpdated) onCarsUpdated();
  };

  const handleDelete = () => {
    if (window.confirm('Delete this car?')) {
      deleteCar(carId)
        .then(() => {
          if (onCarsUpdated) onCarsUpdated();
          onClose();
        })
        .catch(console.error);
    }
  };

  const handleToggleStatus = () => {
    const newStatus = car.status === 'Retired' ? 'Active' : 'Retired';
    updateCar(carId, { status: newStatus })
      .then(() => {
        loadCar();
        if (onCarsUpdated) onCarsUpdated();
      })
      .catch(console.error);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'mot':
        return <MotTab carId={carId} onChange={handleRecordsChange} />;
      case 'insurance':
        return <InsuranceTab carId={carId} onChange={handleRecordsChange} />;
      case 'service':
        return <ServiceTab carId={carId} onChange={handleRecordsChange} />;
      case 'tax':
        return <TaxTab carId={carId} onChange={handleRecordsChange} />;
      case 'mileage':
        return <MileageTab carId={carId} onChange={handleRecordsChange} />;
      default:
        return null;
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <button onClick={onClose} style={styles.closeBtn}>×</button>
        <div style={styles.actionBar}>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
          <button className="btn btn-warning btn-sm" onClick={handleToggleStatus}>
            {car.status === 'Retired' ? 'Activate' : 'Retire'}
          </button>
        </div>

        {/* Always visible Overview */}
        <div style={styles.overview}>
          <OverviewTab car={car} />
        </div>

        {/* Tabs navigation without overview */}
        <div style={styles.tabs}>
          <nav style={styles.nav}>
            {['mot', 'insurance', 'service', 'tax', 'mileage'].map(tab => (
              <button
                key={tab}
                style={{ 
                  ...styles.tabBtn,
                  ...(activeTab === tab ? styles.activeTabBtn : {})
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>

          <div style={styles.tabContent}>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 10000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    width: '95%',
    maxWidth: '1200px',
    height: '90vh',         // Fixed height (static size)
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '2rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  actionBar: {
    display: 'flex',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
  },
  overview: {
    flexShrink: 0,
    padding: '1rem 2rem',
    borderBottom: '1px solid #ddd',
    maxHeight: '400px',      // Increased overview height
    overflowY: 'auto',       // Scroll if overview content is too big
  },
  tabs: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',      // Hide overflow on tabs container
  },
  nav: {
    display: 'flex',
    borderBottom: '1px solid #ccc',
    padding: '0 1rem',
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    padding: '1rem 1.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    borderBottomWidth: '3px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
  },
  activeTabBtn: {
    borderBottomColor: '#007bff',
    fontWeight: 'bold',
  },
  tabContent: {
    flexGrow: 1,
    padding: '1rem 2rem',
    overflowY: 'auto',            // Scroll inside tab content if content too tall
    minHeight: 0,                 // Fixes flexbox overflow issue in some browsers
    maxHeight: 'calc(90vh - 300px - 48px)', // Adjust max height based on overview height and tab nav
  },
};




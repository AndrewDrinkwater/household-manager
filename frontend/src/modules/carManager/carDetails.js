import React, { useState } from 'react';
import OverviewTab from './tabs/OverviewTab';
import MotTab from './tabs/MotTab';
import InsuranceTab from './tabs/InsuranceTab';
import ServiceTab from './tabs/ServiceTab';
import MileageTab from './tabs/MileageTab';

export default function CarDetails({ car, onClose }) {
  const [activeTab, setActiveTab] = useState('mot'); // Default to first actual tab

  const renderTabContent = () => {
    switch (activeTab) {
      case 'mot': return <MotTab carId={car.id} />;
      case 'insurance': return <InsuranceTab carId={car.id} />;
      case 'service': return <ServiceTab carId={car.id} />;
      case 'mileage': return <MileageTab carId={car.id} />;
      default: return null;
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <button onClick={onClose} style={styles.closeBtn}>×</button>

        {/* Always visible Overview */}
        <div style={styles.overview}>
          <OverviewTab car={car} />
        </div>

        {/* Tabs navigation without overview */}
        <div style={styles.tabs}>
          <nav style={styles.nav}>
            {['mot', 'insurance', 'service', 'mileage'].map(tab => (
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
    borderBottom: '3px solid transparent',
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




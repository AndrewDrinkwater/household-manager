import React from 'react';
import Card from '../ui/Card';

export default function HomePage() {
  return (
    <div>
      <h2>Welcome to Household Manager</h2>
      <div className="dashboard-grid">
        <Card title="Services">
          Manage streaming, utilities and other service providers.
        </Card>
        <Card title="Bills">
          Track payment amounts and upcoming due dates.
        </Card>
        <Card title="Documents">
          Upload and store important household files.
        </Card>
      </div>
    </div>
  );
}

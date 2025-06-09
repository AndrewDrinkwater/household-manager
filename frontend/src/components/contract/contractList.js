import React, { useEffect, useState } from 'react';
import { getContracts } from '../../api';

function ContractList() {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    getContracts().then(res => setContracts(res.data));
  }, []);

  return (
    <div>
      <h2>Contracts</h2>
      <ul>
        {contracts.map(contract => (
          <li key={contract.id}>
            <strong>{contract.name}</strong> (#{contract.contract_number})<br />
            Vendor: {contract.vendor ? contract.vendor.name : contract.vendorId}<br />
            User: {contract.user ? contract.user.username : contract.userId}<br />
            Start: {contract.start_date} | End: {contract.end_date}<br />
            Renewal: {contract.renewal_date}<br />
            Notes: {contract.notes}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContractList;

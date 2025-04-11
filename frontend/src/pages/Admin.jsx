import { useState } from 'react';
import { useUserRole } from '../hooks/useUserRole';
import { useContractRead, useContractWrite } from '../hooks/useContracts';
import { Table, Button, Input, message } from 'antd';

function Admin() {
  const { role, isConnected, address } = useUserRole();
  const [deviceAddress, setDeviceAddress] = useState('');
  const [verifierAddress, setVerifierAddress] = useState('');

  const { data: devices } = useContractRead({
    contractName: 'IoTDataAccessControl',
    functionName: 'getAllDevices',
    enabled: role === 'admin',
  });

  const { data: verifiers } = useContractRead({
    contractName: 'IoTDataAccessControl',
    functionName: 'getAllVerifiers',
    enabled: role === 'admin',
  });

  const { write: grantDevice } = useContractWrite({
    contractName: 'IoTDataAccessControl',
    functionName: 'grantDeviceRole',
  });

  const { write: grantVerifier } = useContractWrite({
    contractName: 'IoTDataAccessControl',
    functionName: 'grantVerifierRole',
  });

  const handleGrantDevice = () => {
    if (!deviceAddress) {
      message.error('Please enter a device address');
      return;
    }
    grantDevice([deviceAddress], {
      onSuccess: () => message.success('Device role granted'),
      onError: (error) => message.error(`Error: ${error.message}`),
    });
    setDeviceAddress('');
  };

  const handleGrantVerifier = () => {
    if (!verifierAddress) {
      message.error('Please enter a verifier address');
      return;
    }
    grantVerifier([verifierAddress], {
      onSuccess: () => message.success('Verifier role granted'),
      onError: (error) => message.error(`Error: ${error.message}`),
    });
    setVerifierAddress('');
  };

  if (!isConnected) {
    return <div>Please connect your wallet</div>;
  }

  if (role !== 'admin') {
    return <div>You are not authorized to access this page</div>;
  }

  const deviceColumns = [
    {
      title: 'Device Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const verifierColumns = [
    {
      title: 'Verifier Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const deviceData = devices?.map((addr, index) => ({ key: index, address: addr })) || [];
  const verifierData = verifiers?.map((addr, index) => ({ key: index, address: addr })) || [];

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Admin Panel</h1>

      <div className="mb-6">
        <h2 className="text-xl mb-2">Grant Device Role</h2>
        <Input
          placeholder="Enter device address"
          value={deviceAddress}
          onChange={(e) => setDeviceAddress(e.target.value)}
          className="w-64 mr-2"
        />
        <Button type="primary" onClick={handleGrantDevice}>
          Grant Device
        </Button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl mb-2">Grant Verifier Role</h2>
        <Input
          placeholder="Enter verifier address"
          value={verifierAddress}
          onChange={(e) => setVerifierAddress(e.target.value)}
          className="w-64 mr-2"
        />
        <Button type="primary" onClick={handleGrantVerifier}>
          Grant Verifier
        </Button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl mb-2">Devices</h2>
        <Table columns={deviceColumns} dataSource={deviceData} pagination={false} />
      </div>

      <div>
        <h2 className="text-xl mb-2">Verifiers</h2>
        <Table columns={verifierColumns} dataSource={verifierData} pagination={false} />
      </div>
    </div>
  );
}

export default Admin;
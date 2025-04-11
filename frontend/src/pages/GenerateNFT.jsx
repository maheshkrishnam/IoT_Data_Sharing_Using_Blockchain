import { useState } from 'react';
import { useUserRole } from '../hooks/useUserRole';
import { useContractRead, useContractWrite } from '../hooks/useContracts';
import toast from 'react-hot-toast';

function DeviceNFT() {
  const { isDevice, isConnected } = useUserRole();
  const [deviceId, setDeviceId] = useState('');
  const [dataType, setDataType] = useState('');
  const [location, setLocation] = useState('');
  const [additionalMetadata, setAdditionalMetadata] = useState('');

  const { data: templates } = useContractRead({
    contractName: 'IoTDataFactory',
    functionName: 'getAllTemplate',
    enabled: isConnected,
  });

  const { write: generateNFT, isPending } = useContractWrite({
    contractName: 'IoTDataFactory',
    functionName: 'generateDataNFT',
  });

  const handleGenerateNFT = () => {
    if (!deviceId || !dataType || !location || !additionalMetadata) {
      toast.error('Please fill in all fields');
      return;
    }

    const validTemplate = templates?.some((t) => t.dataType.toLowerCase() === dataType.toLowerCase());
    if (!validTemplate) {
      toast.error('Invalid data type. Choose from existing templates.');
      return;
    }

    const args = [deviceId, dataType.toLowerCase(), location, additionalMetadata];

    generateNFT(args, {
      onSuccess: (tx) => {
        console.log('Transaction successful:', tx);
        toast.success('NFT generated successfully');
        setDeviceId('');
        setDataType('');
        setLocation('');
        setAdditionalMetadata('');
      },
      onError: (err) => {
        console.error('Transaction error:', err);
        toast.error(`Error: ${err.message}`);
      },
    });
  };

  if (!isConnected) {
    return <div className="text-center text-red-500">Please connect your wallet</div>;
  }

  if (!isDevice) {
    return <div className="text-center text-red-500">Only devices can access this page</div>;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Generate Data NFT</h1>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Device ID (e.g., device123)"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={dataType}
          onChange={(e) => setDataType(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Data Type</option>
          {templates?.map((t) => (
            <option key={t.dataType} value={t.dataType}>
              {t.dataType}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Location (e.g., Dharwad)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Additional Metadata (e.g., {'temp': '25'})"
          value={additionalMetadata}
          onChange={(e) => setAdditionalMetadata(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleGenerateNFT}
          disabled={isPending}
          className={`p-2 text-white rounded transition ${
            isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isPending ? 'Generating...' : 'Generate NFT'}
        </button>
      </div>
    </div>
  );
}

export default DeviceNFT;

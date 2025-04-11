import { useState } from 'react';
import { useUserRole } from '../hooks/useUserRole';
import { useContractRead, useContractWrite } from '../hooks/useContracts';
import toast from 'react-hot-toast';

function Templates() {
  const { role, isConnected } = useUserRole();
  const [dataType, setDataType] = useState('');
  const [metadataTemplate, setMetadataTemplate] = useState('');
  const [basePrice, setBasePrice] = useState('');

  const { data: templates } = useContractRead({
    contractName: 'IoTDataFactory',
    functionName: 'getAllTemplate',
    enabled: role === 'admin',
  });

  const { write: createNewTemplate, isPending } = useContractWrite({
    contractName: 'IoTDataFactory',
    functionName: 'createTemplate',
  });

  const handleCreateTemplate = () => {
    if (!dataType || !metadataTemplate || !basePrice) {
      toast.error('Please fill in all fields');
      return;
    }

    const normalizedDataType = dataType.toLowerCase();
    const basePriceNum = Number(basePrice);

    if (isNaN(basePriceNum) || basePriceNum < 0) {
      toast.error('Base Price must be a valid positive number');
      return;
    }

    createNewTemplate(
      [normalizedDataType, metadataTemplate, basePriceNum],
      {
        onSuccess: () => {
          toast.success('Template created successfully');
          setDataType('');
          setMetadataTemplate('');
          setBasePrice('');
        },
        onError: (error) => {
          toast.error(`Error: ${error.message}`);
          console.error('Transaction error:', error);
        },
      }
    );
  };

  if (!isConnected) {
    return <div className="text-center text-gray-600">🔗 Please connect your wallet</div>;
  }

  if (role !== 'admin' && role !== 'device') {
    return <div className="text-center text-red-500 font-semibold">⚠️ Access Denied</div>;
  }

  const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const templateData = templates?.map((template, index) => ({
    key: index,
    dataType: template.dataType,
    metadataTemplate: template.metadataTemplate,
    basePrice: template.basePrice.toString(),
  })) || [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {role === 'admin' && (
        <div className="mb-8 bg-white p-6 shadow-md rounded-md">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800">Manage Templates</h1>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Data Type"
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Metadata Template"
              value={metadataTemplate}
              onChange={(e) => setMetadataTemplate(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Price"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCreateTemplate}
              disabled={isPending}
              className={`w-full p-3 text-white rounded-lg ${
                isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isPending ? 'Creating...' : 'Create Template'}
            </button>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4 text-gray-800">All Templates</h2>

      {templateData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templateData.map((template) => (
            <div key={template.key} className="bg-white p-4 shadow-md rounded-md">
              <p className="text-lg font-semibold text-gray-700">{capitalizeFirstLetter(template.dataType)}</p>
              <p className="text-gray-600">Metadata: {template.metadataTemplate}</p>
              <p className="text-gray-600">Base Price: {template.basePrice} wei</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No templates available</p>
      )}
    </div>
  );
}

export default Templates;

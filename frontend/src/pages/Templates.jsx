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

  const { write: createNewTemplate, isPending, error } = useContractWrite({
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

    // Convert to wei (1 ether = 10^18 wei)
    const basePriceWei = BigInt(basePriceNum * 10**18);

    console.log('Calling createTemplate with:', {
      dataType: normalizedDataType,
      metadataTemplate: metadataTemplate,
      basePrice: basePriceWei.toString(),
    });

    // Call contract with proper argument format
    createNewTemplate(
      [normalizedDataType, metadataTemplate, basePriceWei],
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
    return <div>Please connect your wallet</div>;
  }

  if (role !== 'admin' && role !== 'device') {
    return <div className="text-center text-red-500">You are not authorized to access this page</div>;
  }

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const templateData = templates?.map((template, index) => ({
    key: index,
    dataType: template.dataType,
    metadataTemplate: template.metadataTemplate,
    basePrice: template.basePrice.toString(),
  })) || [];

  return (
    <div className="p-4">
      {role == "admin" && <h1 className="text-2xl mb-4">Manage Templates</h1>}

      {role == 'admin' && <div className="mb-6">
        <h2 className="text-xl mb-2">Create New Template</h2>
        <input
          type="text"
          placeholder="Data Type (e.g., Temperature)"
          value={dataType}
          onChange={(e) => setDataType(e.target.value)}
          className="w-64 mb-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Metadata Template (e.g., value)"
          value={metadataTemplate}
          onChange={(e) => setMetadataTemplate(e.target.value)}
          className="w-64 mb-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Base Price (in ether)"
          value={basePrice}
          onChange={(e) => setBasePrice(e.target.value)}
          className="w-64 mb-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCreateTemplate}
          disabled={isPending}
          className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isPending ? 'Creating...' : 'Create Template'}
        </button>
      </div>}

      <div>
        <h2 className="text-xl mb-2">All Templates</h2>
        {templateData.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Data Type</th>
                <th className="p-2 border">Metadata Template</th>
                <th className="p-2 border">Base Price (wei)</th>
              </tr>
            </thead>
            <tbody>
              {templateData.map((template) => (
                <tr key={template.key} className="hover:bg-gray-100">
                  <td className="p-2 border">{capitalizeFirstLetter(template.dataType)}</td>
                  <td className="p-2 border">{template.metadataTemplate}</td>
                  <td className="p-2 border">{template.basePrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No templates available</p>
        )}
      </div>
    </div>
  );
}

export default Templates;
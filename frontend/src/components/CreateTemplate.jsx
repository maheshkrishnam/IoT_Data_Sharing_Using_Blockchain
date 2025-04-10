import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";

const CONTRACT_ADDRESS = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

const IoTDataFactoryABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_nftAddress", "type": "address" },
      { "internalType": "address", "name": "_accessControlAddress", "type": "address" },
      { "internalType": "address", "name": "_verificationAddress", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": true, "internalType": "string", "name": "dataType", "type": "string" },
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "DataNFTGenerated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "string", "name": "dataType", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "metadataTemplate", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "basePrice", "type": "uint256" }
    ],
    "name": "DataTemplateCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "accessControl",
    "outputs": [{ "internalType": "contract IoTDataAccessControl", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "dataType", "type": "string" },
      { "internalType": "string", "name": "metadataTemplate", "type": "string" },
      { "internalType": "uint256", "name": "basePrice", "type": "uint256" }
    ],
    "name": "createTemplate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "name": "dataTemplates",
    "outputs": [
      { "internalType": "string", "name": "dataType", "type": "string" },
      { "internalType": "string", "name": "metadataTemplate", "type": "string" },
      { "internalType": "uint256", "name": "basePrice", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "deviceId", "type": "string" },
      { "internalType": "string", "name": "dataType", "type": "string" },
      { "internalType": "string", "name": "location", "type": "string" },
      { "internalType": "string", "name": "additionalMetadata", "type": "string" }
    ],
    "name": "generateDataNFT",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllTemplates",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "dataType", "type": "string" },
          { "internalType": "string", "name": "metadataTemplate", "type": "string" },
          { "internalType": "uint256", "name": "basePrice", "type": "uint256" }
        ],
        "internalType": "struct IoTDataFactory.DataTemplate[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "dataType", "type": "string" }],
    "name": "getTemplate",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "dataType", "type": "string" },
          { "internalType": "string", "name": "metadataTemplate", "type": "string" },
          { "internalType": "uint256", "name": "basePrice", "type": "uint256" }
        ],
        "internalType": "struct IoTDataFactory.DataTemplate",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTemplateCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nftContract",
    "outputs": [{ "internalType": "contract IoTDataNFT", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "verificationContract",
    "outputs": [{ "internalType": "contract DataVerification", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
];

export function AdminTemplateManager() {
  const { address } = useAccount();
  const [templateData, setTemplateData] = useState({
    dataType: "",
    metadataTemplate: "",
    basePrice: "",
  });

  const predefinedTemplates = [
    {
      dataType: "temperature_v2",
      metadataTemplate: '{"unit": "Celsius", "deviceId": "DEVICE_ID"}',
      basePrice: "0.01",
    },
    {
      dataType: "humidity",
      metadataTemplate: '{"unit": "%", "deviceId": "DEVICE_ID"}',
      basePrice: "0.02",
    },
    {
      dataType: "pressure",
      metadataTemplate: '{"unit": "hPa", "deviceId": "DEVICE_ID"}',
      basePrice: "0.015",
    },
  ];

  const { data: owner, isLoading: isOwnerLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: IoTDataFactoryABI,
    functionName: "owner",
  });

  const { data: allTemplates, refetch: refetchTemplates } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: IoTDataFactoryABI,
    functionName: "getAllTemplates",
  });

  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    if (allTemplates) {
      console.log("Existing templates:", allTemplates);
    }
  }, [allTemplates]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTemplateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const usePredefinedTemplate = (template) => {
    setTemplateData({
      dataType: template.dataType,
      metadataTemplate: template.metadataTemplate,
      basePrice: template.basePrice,
    });
  };

  const handleCreateTemplate = async () => {
    if (!templateData.dataType || !templateData.metadataTemplate || !templateData.basePrice) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      JSON.parse(templateData.metadataTemplate);
    } catch (e) {
      toast.error("Metadata Template must be valid JSON");
      return;
    }

    try {
      const basePriceInWei = ethers.parseEther(templateData.basePrice.toString());
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: IoTDataFactoryABI,
        functionName: "createTemplate",
        args: [templateData.dataType, templateData.metadataTemplate, basePriceInWei],
        gasLimit: 300000, // Increase if needed
      });
      toast.success("Template created successfully!");
      setTemplateData({
        dataType: "",
        metadataTemplate: "",
        basePrice: "",
      });
      refetchTemplates();
    } catch (error) {
      console.error("Create template error:", error);
      if (error.cause && error.cause.reason) {
        toast.error(`Failed: ${error.cause.reason}`);
      } else if (error.message.includes("reverted")) {
        toast.error("Failed: Transaction reverted, check if you're the owner or network is active");
      } else {
        toast.error(`Failed: ${error.message || "Transaction failed"}`);
      }
    }
  };

  if (isOwnerLoading) return <p>Loading owner status...</p>;
  if (owner !== address) return <p>You are not the contract owner.</p>;

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Template Manager</h2>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3 text-gray-700">Predefined Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {predefinedTemplates.map((template, index) => (
            <div key={index} className="border p-4 rounded-lg bg-gray-50">
              <p><strong>Data Type:</strong> {template.dataType}</p>
              <p><strong>Metadata:</strong> {template.metadataTemplate}</p>
              <p><strong>Base Price:</strong> {template.basePrice} ETH</p>
              <button
                onClick={() => usePredefinedTemplate(template)}
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3 text-gray-700">Create New Template</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Data Type</label>
            <input
              type="text"
              name="dataType"
              placeholder="e.g., temperature, humidity"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={templateData.dataType}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Metadata Template (JSON)</label>
            <textarea
              name="metadataTemplate"
              placeholder='{"device": "DEVICE_ID", "type": "TYPE", ...}'
              className="w-full p-2 border rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={templateData.metadataTemplate}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Base Price (ETH)</label>
            <input
              type="number"
              name="basePrice"
              placeholder="0.01"
              step="0.001"
              min="0"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={templateData.basePrice}
              onChange={handleInputChange}
            />
          </div>

          <button
            onClick={handleCreateTemplate}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Create Template
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3 text-gray-700">Existing Templates</h3>
        {allTemplates && allTemplates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Price (ETH)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metadata Template</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allTemplates.map((template, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {template.dataType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ethers.formatEther(template.basePrice)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="truncate max-w-xs">
                        {template.metadataTemplate}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No templates created yet.</p>
        )}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useUserRole } from '../hooks/useUserRole';
import { useContractRead, useContractWrite } from '../hooks/useContracts';
import toast from 'react-hot-toast';
import axios from 'axios';

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_API_SECRET = import.meta.env.VITE_PINATA_API_SECRET;

function DeviceNFT() {
  const { isDevice, isConnected } = useUserRole();
  const [deviceId, setDeviceId] = useState('');
  const [dataType, setDataType] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState(null);
  const [ipfsUrl, setIpfsUrl] = useState(''); 

  const { data: templates } = useContractRead({
    contractName: "IoTDataFactory",
    functionName: "getAllTemplate",
    enabled: isConnected,
  });

  const { write: generateNFT, isPending } = useContractWrite({
    contractName: "IoTDataFactory",
    functionName: "generateDataNFT",
  });

  const handleUploadAndGenerate = async () => {
    if (!deviceId || !dataType || !location) {
      toast.error('Please fill in Device ID, Data Type, and Location');
      return;
    }

    if (!file) {
      toast.error('Please upload a file');
      return;
    }

    const validTemplate = templates?.some(
      (t) => t.dataType.toLowerCase() === dataType.toLowerCase()
    );
    if (!validTemplate) {
      toast.error("Invalid data type. Choose from existing templates.");
      return;
    }

    try {
      toast.loading('Uploading to IPFS...');
      const formData = new FormData();
      formData.append('file', file);

      const fileResponse = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_API_SECRET,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const fileCid = fileResponse.data.IpfsHash;
      const fileUrl = `https://gateway.pinata.cloud/ipfs/${fileCid}`;
      setIpfsUrl(fileUrl); 
      toast.dismiss();
      toast.success('File uploaded to IPFS successfully!');

      const args = [deviceId, dataType.toLowerCase(), location, fileUrl];
      generateNFT(args, {
        onSuccess: () => {
          toast.success('NFT generated successfully!');
          setDeviceId('');
          setDataType('');
          setLocation('');
          setFile(null);
          setIpfsUrl('');
        },
        onError: (err) => {
          toast.error(`NFT generation failed: ${err.message}`);
        },
      });
    } catch (error) {
      console.error('IPFS upload error:', error);
      toast.dismiss();
      toast.error(`Upload failed: ${error.message}`);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center text-red-500 text-2xl pt-10">
        Please connect your wallet
      </div>
    );
  }

  if (!isDevice) {
    return (
      <div className="text-center text-red-500 text-2xl pt-10">
        Only devices can access this page
      </div>
    );
  }

  const isFormValid = deviceId && dataType && location;
  const hasDataForUpload = file;
  const isButtonDisabled = isPending || !isFormValid || !hasDataForUpload;

  return (
    <div className="pt-10 max-w-3xl m-auto">
      <h1 className="text-2xl font-bold mb-4">Generate Data NFT</h1>

      <div className="flex flex-col gap-5 w-full">
        <input
          type="text"
          placeholder="Device ID"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          className="bg-gray-600 text-gray-100 p-2 border rounded"
        />

        <select
          value={dataType}
          onChange={(e) => setDataType(e.target.value)}
          className=" bg-gray-600 text-gray-100 p-2 border rounded"
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
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-gray-600 text-gray-100 p-2 border rounded"
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Upload a file:</label>
          <input
            type="file"
            onChange={(e) => {
              setFile(e.target.files[0]);
              setIpfsUrl(''); 
            }}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleUploadAndGenerate}
          disabled={isButtonDisabled}
          className={`p-2 text-white rounded transition ${
            isButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isPending ? 'Processing...' : 'Generate NFT'}
        </button>
      </div>
    </div>
  );
}

export default DeviceNFT;
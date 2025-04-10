import Navbar from '../components/Navbar.jsx';
import { useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

const NFT_CONTRACT_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
const ACCESS_CONTROL_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const NFT_CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "string", "name": "uri", "type": "string" },
      { "internalType": "string", "name": "deviceId", "type": "string" },
      { "internalType": "string", "name": "dataType", "type": "string" },
      { "internalType": "string", "name": "location", "type": "string" }
    ],
    "name": "safeMint",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "accessControlContract",
    "outputs": [{ "internalType": "contract IoTDataAccessControl", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
];

const ACCESS_CONTROL_ABI = [
  {
    "inputs": [
      { "internalType": "bytes32", "name": "role", "type": "bytes32" },
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "hasRole",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MINTER_ROLE",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "grantMinterRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DEFAULT_ADMIN_ROLE",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "role", "type": "bytes32" },
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default function Home() {
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [dataType, setDataType] = useState('');
  const [location, setLocation] = useState('');
  const [uploading, setUploading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [minting, setMinting] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  const [hasMinterRole, setHasMinterRole] = useState(false);
  const [hasAdminRole, setHasAdminRole] = useState(false);

  const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
  const PINATA_API_SECRET = import.meta.env.VITE_PINATA_API_SECRET;
  const PINATA_API_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setWalletConnected(true);
        console.log('Connected account:', accounts[0]);
        await checkRoles(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet');
      }
    } else {
      alert('Please install MetaMask to mint NFTs');
    }
  };

  const checkRoles = async (accountToCheck) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accessControlContract = new ethers.Contract(ACCESS_CONTROL_ADDRESS, ACCESS_CONTROL_ABI, provider);
      const MINTER_ROLE = await accessControlContract.MINTER_ROLE();
      const DEFAULT_ADMIN_ROLE = await accessControlContract.DEFAULT_ADMIN_ROLE();
      const hasMinter = await accessControlContract.hasRole(MINTER_ROLE, accountToCheck);
      const hasAdmin = await accessControlContract.hasRole(DEFAULT_ADMIN_ROLE, accountToCheck);
      setHasMinterRole(hasMinter);
      setHasAdminRole(hasAdmin);
      console.log(`Account ${accountToCheck} - MINTER_ROLE: ${hasMinter}, DEFAULT_ADMIN_ROLE: ${hasAdmin}`);
    } catch (error) {
      console.error('Error checking roles:', error);
      setHasMinterRole(false);
      setHasAdminRole(false);
    }
  };

  const grantMinterRole = async () => {
    if (!hasAdminRole) {
      alert('You need DEFAULT_ADMIN_ROLE to grant MINTER_ROLE.');
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const accessControlContract = new ethers.Contract(ACCESS_CONTROL_ADDRESS, ACCESS_CONTROL_ABI, signer);
      const tx = await accessControlContract.grantMinterRole(account);
      await tx.wait();
      setHasMinterRole(true);
      alert('MINTER_ROLE granted successfully!');
    } catch (error) {
      console.error('Error granting MINTER_ROLE:', error);
      alert(`Failed to grant MINTER_ROLE: ${error.message}`);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleJsonChange = (e) => setJsonData(e.target.value);
  const handleDeviceIdChange = (e) => setDeviceId(e.target.value);
  const handleDataTypeChange = (e) => setDataType(e.target.value);
  const handleLocationChange = (e) => setLocation(e.target.value);

  const uploadToPinata = async (e) => {
    e.preventDefault();
    if (!file && !jsonData) {
      alert('Please select a file or enter JSON data');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      let uploadFile;

      if (file) {
        uploadFile = file;
      } else if (jsonData) {
        try {
          JSON.parse(jsonData);
        } catch (error) {
          alert('Invalid JSON format. Please check your input.');
          console.error('JSON Parse Error:', error);
          setUploading(false);
          return;
        }
        const jsonBlob = new Blob([jsonData], { type: 'application/json' });
        uploadFile = new File([jsonBlob], 'nft-metadata.json', { type: 'application/json' });
      }

      formData.append('file', uploadFile);
      const metadata = { name: uploadFile.name, keyvalues: { project: 'IoT Data NFT' } };
      formData.append('pinataMetadata', JSON.stringify(metadata));

      const response = await axios.post(PINATA_API_URL, formData, {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_API_SECRET,
          'Content-Type': 'multipart/form-data',
        },
      });

      const hash = response.data.IpfsHash;
      setIpfsHash(hash);
      console.log('Uploaded to IPFS with hash:', hash);
      setFile(null);
      setJsonData('');
    } catch (error) {
      console.error('Error uploading to Pinata:', error);
      alert(`Failed to upload: ${error.response?.data?.error || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const mintNFT = async () => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }
    if (!ipfsHash) {
      alert('Please upload a file or JSON data to IPFS first');
      return;
    }
    if (!deviceId || !dataType || !location) {
      alert('Please fill in all metadata fields (Device ID, Data Type, Location)');
      return;
    }
    if (!hasMinterRole) {
      alert('You do not have the MINTER_ROLE. Use the button below to grant it if you have admin rights.');
      return;
    }

    setMinting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);

      const tokenURI = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      const tx = await contract.safeMint(account, tokenURI, deviceId, dataType, location);
      const receipt = await tx.wait();

      const transferEvent = receipt.logs.find(log => 
        log.topics[0] === ethers.id("Transfer(address,address,uint256)")
      );
      const tokenId = transferEvent ? ethers.toNumber(transferEvent.topics[3]) : 'Unknown';
      setTokenId(tokenId);
      console.log('NFT minted with transaction:', receipt);
      alert('NFT minted successfully!');
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert(`Failed to mint NFT: ${error.message}`);
    } finally {
      setMinting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Welcome to IoT Data NFT</h2>

        <div className="mb-4">
          {!walletConnected ? (
            <button
              onClick={connectWallet}
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Connect Wallet
            </button>
          ) : (
            <div>
              <p className="text-sm text-green-600">
                Wallet connected: {account?.slice(0, 6)}...{account?.slice(-4)}
                {hasMinterRole ? ' (Minter)' : ' (Not a Minter)'}
                {hasAdminRole ? ' (Admin)' : ''}
              </p>
              {!hasMinterRole && hasAdminRole && (
                <button
                  onClick={grantMinterRole}
                  className="mt-2 py-1 px-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                >
                  Grant Myself MINTER_ROLE
                </button>
              )}
            </div>
          )}
        </div>

        <div className="max-w-md">
          <form onSubmit={uploadToPinata} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload File for NFT
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0 file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={uploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or Enter NFT Metadata (JSON)
              </label>
              <textarea
                value={jsonData}
                onChange={handleJsonChange}
                placeholder='{"name": "My NFT", "description": "An IoT Data NFT", "attributes": []}'
                className="w-full h-32 p-2 border rounded-md text-sm text-gray-700
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={uploading}
              />
            </div>

            <button
              type="submit"
              disabled={(!file && !jsonData) || uploading}
              className={`w-full py-2 px-4 rounded-md text-white
                ${uploading || (!file && !jsonData)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {uploading ? 'Uploading...' : 'Upload to IPFS'}
            </button>
          </form>

          {ipfsHash && (
            <div className="mt-4 p-4 bg-green-100 rounded-md">
              <p className="text-sm text-green-800">Uploaded successfully!</p>
              <p className="text-sm break-all">IPFS Hash: {ipfsHash}</p>
              <a
                href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                View on IPFS
              </a>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device ID</label>
                  <input
                    type="text"
                    value={deviceId}
                    onChange={handleDeviceIdChange}
                    placeholder="e.g., Sensor123"
                    className="w-full p-2 border rounded-md text-sm text-gray-700
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={minting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Type</label>
                  <input
                    type="text"
                    value={dataType}
                    onChange={handleDataTypeChange}
                    placeholder="e.g., Temperature"
                    className="w-full p-2 border rounded-md text-sm text-gray-700
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={minting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={handleLocationChange}
                    placeholder="e.g., Room 101"
                    className="w-full p-2 border rounded-md text-sm text-gray-700
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={minting}
                  />
                </div>

                <button
                  onClick={mintNFT}
                  disabled={minting || !deviceId || !dataType || !location || !hasMinterRole}
                  className={`w-full py-2 px-4 rounded-md text-white
                    ${minting || !deviceId || !dataType || !location || !hasMinterRole
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'}`}
                >
                  {minting ? 'Minting...' : 'Mint NFT'}
                </button>
                {!hasMinterRole && !hasAdminRole && (
                  <p className="text-sm text-red-600 mt-2">
                    You need MINTER_ROLE to mint NFTs. Contact the admin at 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266.
                  </p>
                )}
              </div>
            </div>
          )}

          {tokenId && (
            <div className="mt-4 p-4 bg-blue-100 rounded-md">
              <p className="text-sm text-blue-800">NFT Minted! Token ID: {tokenId}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useUserRole } from '../hooks/useUserRole';
import { useContractRead } from '../hooks/useContracts';
import toast from 'react-hot-toast';

function DeviceNFTs() {
  const { role, isDevice, isConnected } = useUserRole();
  const { address } = useAccount();
  const [nftContractAddress, setNftContractAddress] = useState(null);

  const { data: nftAddress } = useContractRead({
    contractName: 'IoTDataFactory',
    functionName: 'nftContract',
    enabled: isConnected,
  });

  const { data: ownedNFTs, isLoading, error } = useContractRead({
    contractName: 'IoTDataNFT',
    functionName: 'getOwnedNFTs',
    args: [address],
    enabled: !!nftContractAddress && !!address && role === 'device',
    address: nftContractAddress,
  });

  useEffect(() => {
    if (nftAddress) {
      setNftContractAddress(nftAddress);
    }
  }, [nftAddress]);

  if (!isConnected) {
    return <div className="text-center text-red-500">Please connect your wallet</div>;
  }

  if (!isDevice) {
    return <div className="text-center text-red-500">Only devices can access this page</div>;
  }

  if (isLoading) {
    return <div className="text-center">Loading your NFTs...</div>;
  }

  if (error) {
    toast.error(`Error fetching NFTs: ${error.message}`);
    console.error('NFT fetch error:', error);
    return <div className="text-center text-red-500">Failed to load NFTs</div>;
  }

  const nftList =
    ownedNFTs?.map((nft, index) => {
      const uriParts = nft.uri.split('|');
      return {
        key: index,
        tokenId: nft.tokenId.toString(),
        deviceId: nft.deviceId,
        timestamp: new Date(Number(nft.timestamp) * 1000).toLocaleString(),
        dataType: nft.dataType,
        location: nft.location,
        metadataTemplate: uriParts[0] || '',
        additionalMetadata: uriParts[1] || '',
      };
    }) || [];

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4 font-semibold">Your Generated NFTs</h1>

      {nftList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nftList.map((nft) => (
            <div key={nft.key} className="p-4 border rounded-lg shadow-md bg-white">
              <p className="text-lg font-semibold">Token ID: {nft.tokenId}</p>
              <p className="text-sm text-gray-600">Device ID: {nft.deviceId}</p>
              <p className="text-sm text-gray-600">Data Type: {nft.dataType}</p>
              <p className="text-sm text-gray-600">Location: {nft.location}</p>
              <p className="text-sm text-gray-600">Timestamp: {nft.timestamp}</p>
              <p className="text-sm text-gray-600">Template: {nft.metadataTemplate}</p>
              <p className="text-sm text-gray-600">Metadata: {nft.additionalMetadata}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-700">No NFTs found for this device</p>
      )}
    </div>
  );
}

export default DeviceNFTs;

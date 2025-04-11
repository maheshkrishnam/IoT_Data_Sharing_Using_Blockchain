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

  const nftList = ownedNFTs?.map((nft, index) => {
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
      <h1 className="text-2xl mb-4">Your Generated NFTs</h1>

      {nftList.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Token ID</th>
              <th className="p-2 border">Device ID</th>
              <th className="p-2 border">Data Type</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Timestamp</th>
              <th className="p-2 border">Template</th>
              <th className="p-2 border">Additional Metadata</th>
            </tr>
          </thead>
          <tbody>
            {nftList.map((nft) => (
              <tr key={nft.key} className="hover:bg-gray-100">
                <td className="p-2 border">{nft.tokenId}</td>
                <td className="p-2 border">{nft.deviceId}</td>
                <td className="p-2 border">{nft.dataType}</td>
                <td className="p-2 border">{nft.location}</td>
                <td className="p-2 border">{nft.timestamp}</td>
                <td className="p-2 border">{nft.metadataTemplate}</td>
                <td className="p-2 border">{nft.additionalMetadata}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No NFTs found for this device</p>
      )}
    </div>
  );
}

export default DeviceNFTs;
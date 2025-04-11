import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useContractRead } from '../hooks/useContracts';
import toast from 'react-hot-toast';

function Marketplace() {
  const { isConnected } = useAccount();
  const [nftContractAddress, setNftContractAddress] = useState(null);

  const { data: nftAddress } = useContractRead({
    contractName: 'IoTDataFactory',
    functionName: 'nftContract',
    enabled: isConnected,
  });

  const { data: verifiedNFTs, isLoading, error } = useContractRead({
    contractName: 'IoTDataNFT',
    functionName: 'getAllVerifiedNFTs',
    enabled: !!nftContractAddress && isConnected,
    address: nftContractAddress,
  });

  useEffect(() => {
    if (nftAddress) {
      setNftContractAddress(nftAddress);
      console.log('IoTDataNFT address:', nftAddress);
    }
  }, [nftAddress]);

  if (!isConnected) {
    return <div className="text-center text-red-500">Please connect your wallet</div>;
  }

  if (isLoading) {
    return <div className="text-center">Loading verified NFTs...</div>;
  }

  if (error) {
    toast.error(`Error fetching verified NFTs: ${error.message}`);
    console.error('NFT fetch error:', error);
    return <div className="text-center text-red-500">Failed to load verified NFTs</div>;
  }

  const nftList =
    verifiedNFTs?.map((nft, index) => {
      const uriParts = nft.uri.split('|');
      return {
        key: index,
        tokenId: nft.tokenId.toString(),
        owner: nft.owner,
        deviceId: nft.deviceId,
        timestamp: new Date(Number(nft.timestamp) * 1000).toLocaleString(),
        dataType: nft.dataType,
        location: nft.location,
        metadataTemplate: uriParts[0] || '',
        additionalMetadata: uriParts[1] || '',
      };
    }) || [];

  console.log('Verified NFT list:', nftList);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Verified NFT Marketplace</h1>

      {nftList.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {nftList.map((nft) => (
            <div key={nft.key} className="bg-white shadow-lg rounded-lg p-4 border">
              <h2 className="text-lg font-semibold mb-2">Token ID: {nft.tokenId}</h2>
              <p className="text-sm text-gray-600">Owner: <span className="font-medium">{nft.owner}</span></p>
              <p className="text-sm text-gray-600">Device ID: <span className="font-medium">{nft.deviceId}</span></p>
              <p className="text-sm text-gray-600">Data Type: <span className="font-medium">{nft.dataType}</span></p>
              <p className="text-sm text-gray-600">Location: <span className="font-medium">{nft.location}</span></p>
              <p className="text-sm text-gray-600">Timestamp: <span className="font-medium">{nft.timestamp}</span></p>
              <p className="text-sm text-gray-600">Metadata Template: <span className="font-medium">{nft.metadataTemplate}</span></p>
              <p className="text-sm text-gray-600">Additional Metadata: <span className="font-medium">{nft.additionalMetadata}</span></p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No verified NFTs available yet</p>
      )}
    </div>
  );
}

export default Marketplace;

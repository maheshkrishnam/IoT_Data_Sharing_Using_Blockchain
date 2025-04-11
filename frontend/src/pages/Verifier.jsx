import { useState, useEffect } from 'react';
import { useUserRole } from '../hooks/useUserRole';
import { useContractRead, useContractWrite } from '../hooks/useContracts';
import toast from 'react-hot-toast';

function VerifierNFTs() {
  const { isVerifier, isConnected } = useUserRole();
  const [nftContractAddress, setNftContractAddress] = useState(null);
  const [comments, setComments] = useState({});

  const { data: nftAddress } = useContractRead({
    contractName: 'IoTDataFactory',
    functionName: 'nftContract',
    enabled: isConnected,
  });

  const { data: unverifiedNFTs, isLoading, error } = useContractRead({
    contractName: 'IoTDataNFT',
    functionName: 'getAllUnverifiedNFTs',
    enabled: !!nftContractAddress && isConnected,
    address: nftContractAddress,
  });

  const { write: verifyData, isPending } = useContractWrite({
    contractName: 'DataVerification',
    functionName: 'verifyData',
  });

  useEffect(() => {
    if (nftAddress) {
      setNftContractAddress(nftAddress);
    }
  }, [nftAddress]);

  const handleVerify = (tokenId, status) => {
    const comment = comments[tokenId] || 'No comment';
    verifyData([tokenId, status, comment], {
      onSuccess: () => {
        toast.success(`NFT ${tokenId} ${status === 1 ? 'Verified' : 'Rejected'}`);
        setComments((prev) => ({ ...prev, [tokenId]: '' }));
      },
      onError: (err) => toast.error(`Error: ${err.message}`),
    });
  };

  if (!isConnected) return <div className="text-center text-red-500">Please connect your wallet</div>;
  if (!isVerifier) return <div className="text-center text-red-500">Only verifiers can access this page</div>;
  if (isLoading) return <div className="text-center">Loading unverified NFTs...</div>;
  if (error) return <div className="text-center text-red-500">Failed to load unverified NFTs</div>;

  const nftList =
    unverifiedNFTs?.map((nft, index) => {
      const uriParts = nft.uri.split('|');
      return {
        key: index,
        tokenId: nft.tokenId.toString(),
        owner: nft.owner,
        deviceId: nft.deviceId,
        dataType: nft.dataType,
        location: nft.location,
        timestamp: new Date(Number(nft.timestamp) * 1000).toLocaleString(),
        metadataTemplate: uriParts[0] || '',
        additionalMetadata: uriParts[1] || '',
      };
    }) || [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Verify NFTs</h1>

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
              <p className="text-sm text-gray-600">Template: <span className="font-medium">{nft.metadataTemplate}</span></p>
              <p className="text-sm text-gray-600">Additional Metadata: <span className="font-medium">{nft.additionalMetadata}</span></p>

              <input
                type="text"
                value={comments[nft.tokenId] || ''}
                onChange={(e) => setComments((prev) => ({ ...prev, [nft.tokenId]: e.target.value }))}
                placeholder="Add comment"
                className="w-full p-1 border rounded mt-2"
              />

              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleVerify(nft.tokenId, 1)}
                  disabled={isPending}
                  className={`px-3 py-1 bg-green-500 text-white rounded ${isPending ? 'opacity-50' : 'hover:bg-green-600'}`}
                >
                  {isPending ? 'Processing...' : 'Verify'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No unverified NFTs available</p>
      )}
    </div>
  );
}

export default VerifierNFTs;

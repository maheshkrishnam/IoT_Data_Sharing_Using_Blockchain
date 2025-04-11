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

  const { write: verifyData, isPending, } = useContractWrite({
    contractName: 'DataVerification',
    functionName: 'verifyData',
  });

  useEffect(() => {
    if (nftAddress) {
      setNftContractAddress(nftAddress);
      console.log('IoTDataNFT address:', nftAddress);
    }
  }, [nftAddress]);

  const handleVerify = (tokenId, status) => {
    const comment = comments[tokenId] || 'No comment';

    verifyData(
      [tokenId, status, comment],
      {
      onSuccess: (tx) => {
        const statusText = status === 1 ? 'Verified' : 'Rejected';
        console.log('Verification successful:', tx);
        toast.success(`NFT ${tokenId} marked as ${statusText}`);
        setComments((prev) => ({ ...prev, [tokenId]: '' }));
      },
      onError: (err) => {
        console.error('Verification error:', err);
        toast.error(`Error: ${err.message}`);
      },
    });
  };

  const handleCommentChange = (tokenId, value) => {
    setComments((prev) => ({ ...prev, [tokenId]: value }));
  };

  if (!isConnected) return <div className="text-center text-red-500">Please connect your wallet</div>;
  if (!isVerifier) return <div className="text-center text-red-500">Only verifiers can access this page</div>;
  if (isLoading) return <div className="text-center">Loading unverified NFTs...</div>;
  if (error) {
    toast.error(`Error fetching unverified NFTs: ${error.message}`);
    console.error('NFT fetch error:', error);
    return <div className="text-center text-red-500">Failed to load unverified NFTs</div>;
  }

  const nftList = unverifiedNFTs?.map((nft, index) => {
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

  console.log('Unverified NFT list:', nftList);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Verify NFTs</h1>

      {nftList.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Token ID</th>
              <th className="p-2 border">Owner</th>
              <th className="p-2 border">Device ID</th>
              <th className="p-2 border">Data Type</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Timestamp</th>
              <th className="p-2 border">Template</th>
              <th className="p-2 border">Additional Metadata</th>
              <th className="p-2 border">Comments</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {nftList.map((nft) => (
              <tr key={nft.key} className="hover:bg-gray-100">
                <td className="p-2 border">{nft.tokenId}</td>
                <td className="p-2 border">{nft.owner}</td>
                <td className="p-2 border">{nft.deviceId}</td>
                <td className="p-2 border">{nft.dataType}</td>
                <td className="p-2 border">{nft.location}</td>
                <td className="p-2 border">{nft.timestamp}</td>
                <td className="p-2 border">{nft.metadataTemplate}</td>
                <td className="p-2 border">{nft.additionalMetadata}</td>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={comments[nft.tokenId] || ''}
                    onChange={(e) => handleCommentChange(nft.tokenId, e.target.value)}
                    placeholder="Add comment"
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleVerify(nft.tokenId, 1)} // VERIFIED
                    disabled={isPending}
                    className={`px-2 py-1 bg-green-500 text-white rounded mr-2 ${isPending ? 'opacity-50' : 'hover:bg-green-600'}`}
                  >
                    {isPending ? 'Processing...' : 'Verify'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No unverified NFTs available</p>
      )}
    </div>
  );
}

export default VerifierNFTs;
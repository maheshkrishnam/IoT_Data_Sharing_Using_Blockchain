import { useState, useEffect } from "react";
import { useUserRole } from "../hooks/useUserRole";
import { useContractRead, useContractWrite } from "../hooks/useContracts";
import toast from "react-hot-toast";

function VerifierNFTs() {
  const { isVerifier, isConnected } = useUserRole();
  const [nftContractAddress, setNftContractAddress] = useState(null);
  const [comments, setComments] = useState({});

  const { data: nftAddress } = useContractRead({
    contractName: "IoTDataFactory",
    functionName: "nftContract",
    enabled: isConnected,
  });

  const {
    data: unverifiedNFTs,
    isLoading,
    error,
  } = useContractRead({
    contractName: "IoTDataNFT",
    functionName: "getAllUnverifiedNFTs",
    enabled: !!nftContractAddress && isConnected,
    address: nftContractAddress,
  });

  const { write: verifyData, isPending } = useContractWrite({
    contractName: "DataVerification",
    functionName: "verifyData",
  });

  useEffect(() => {
    if (nftAddress) {
      setNftContractAddress(nftAddress);
    }
  }, [nftAddress]);

  const openData = (ipfsUrl) => {
    if (!ipfsUrl) {
      toast.error("No data available");
      return;
    }

    try {
      // Open the IPFS URL in a new tab
      window.open(ipfsUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error opening IPFS data:", error);
      toast.error(`Failed to open data: ${error.message}`);
    }
  };

  const handleVerify = (tokenId, status) => {
    const comment = comments[tokenId] || "No comment";
    verifyData([tokenId, status, comment], {
      onSuccess: () => {
        toast.success(
          `NFT ${tokenId} ${status === 1 ? "Verified" : "Rejected"}`
        );
        setComments((prev) => ({ ...prev, [tokenId]: "" }));
      },
      onError: (err) => toast.error(`Error: ${err.message}`),
    });
  };

  if (!isConnected)
    return (
      <div className="text-center text-red-500 text-2xl pt-10">
        Please connect your wallet
      </div>
    );
  if (!isVerifier)
    return (
      <div className="text-center text-red-500 text-2xl pt-10">
        Only verifiers can access this page
      </div>
    );
  if (isLoading)
    return <div className="text-center">Loading unverified NFTs...</div>;
  if (error)
    return (
      <div className="text-center text-red-500">
        Failed to load unverified NFTs
      </div>
    );

  const nftList =
    unverifiedNFTs?.map((nft, index) => {
      const uriParts = nft.uri.split("|");
      return {
        key: index,
        tokenId: nft.tokenId.toString(),
        owner: nft.owner,
        deviceId: nft.deviceId,
        dataType: nft.dataType,
        location: nft.location,
        timestamp: new Date(Number(nft.timestamp) * 1000).toLocaleString(),
        metadataTemplate: uriParts[0] || "",
        additionalMetadata: uriParts[1] || "",
      };
    }) || [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Verify NFTs</h1>

      {nftList.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {nftList.map((nft) => (
            <div
              key={nft.key}
              className="bg-gray-600 text-gray-100 shadow-lg rounded-lg p-4 border min-w-[280px] max-w-sm"
            >
              <h2 className="text-lg font-semibold mb-2">
                Token ID: {nft.tokenId}
              </h2>
              <p className="text-sm">
                Owner: <span className="font-medium">{nft.owner}</span>
              </p>
              <p className="text-sm">
                Device ID: <span className="font-medium">{nft.deviceId}</span>
              </p>
              <p className="text-sm">
                Data Type: <span className="font-medium">{nft.dataType}</span>
              </p>
              <p className="text-sm">
                Location: <span className="font-medium">{nft.location}</span>
              </p>
              <p className="text-sm">
                Timestamp: <span className="font-medium">{nft.timestamp}</span>
              </p>
              <p className="text-sm">
                Template:{" "}
                <span className="font-medium">{nft.metadataTemplate}</span>
              </p>
              <p className="text-sm"> Metadata:
                <button
                  onClick={() => openData(nft.additionalMetadata)}
                  className={`text-blue-500 hover:underline ${
                    !nft.additionalMetadata ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!nft.additionalMetadata}
                >
                  Get Data
                </button>
              </p>

              <input
                type="text"
                value={comments[nft.tokenId] || ""}
                onChange={(e) =>
                  setComments((prev) => ({
                    ...prev,
                    [nft.tokenId]: e.target.value,
                  }))
                }
                placeholder="Add comment"
                className="w-full p-2 border rounded mt-3 bg-gray-100 text-gray-700 placeholder:text-gray-400"
              />

              <div className="flex justify-end mt-3">
                <button
                  onClick={() => handleVerify(nft.tokenId, 1)}
                  disabled={isPending}
                  className={`px-4 py-2 text-sm rounded font-medium text-white transition ${
                    isPending
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {isPending ? "Processing..." : "Verify"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No unverified NFTs available
        </p>
      )}
    </div>
  );
}

export default VerifierNFTs;
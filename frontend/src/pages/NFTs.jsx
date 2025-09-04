import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useUserRole } from "../hooks/useUserRole";
import { useContractRead } from "../hooks/useContracts";
import toast from "react-hot-toast";

function DeviceNFTs() {
  const { role, isDevice, isConnected } = useUserRole();
  const { address } = useAccount();
  const [nftContractAddress, setNftContractAddress] = useState(null);

  const { data: nftAddress } = useContractRead({
    contractName: "IoTDataFactory",
    functionName: "nftContract",
    enabled: isConnected,
  });

  const {
    data: ownedNFTs,
    isLoading,
    error,
  } = useContractRead({
    contractName: "IoTDataNFT",
    functionName: "getOwnedNFTs",
    args: [address],
    enabled: !!nftContractAddress && !!address && role === "device",
    address: nftContractAddress,
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
      window.open(ipfsUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error opening IPFS data:", error);
      toast.error(`Failed to open data: ${error.message}`);
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

  if (isLoading) {
    return <div className="text-center">Loading your NFTs...</div>;
  }

  if (error) {
    toast.error(`Error fetching NFTs: ${error.message}`);
    console.error("NFT fetch error:", error);
    return <div className="text-center text-red-500">Failed to load NFTs</div>;
  }

  const nftList =
    ownedNFTs?.map((nft, index) => {
      const uriParts = nft.uri.split("|");
      return {
        key: index,
        tokenId: nft.tokenId.toString(),
        deviceId: nft.deviceId,
        timestamp: new Date(Number(nft.timestamp) * 1000).toLocaleString(),
        dataType: nft.dataType,
        location: nft.location,
        metadataTemplate: uriParts[0] || "",
        additionalMetadata: uriParts[1] || "",
      };
    }) || [];

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4 font-semibold w-full">
        Your Generated NFTs
      </h1>

      {nftList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {nftList.map((nft) => (
            <div
              key={nft.key}
              className="flex-1 w-full p-4 border rounded-lg shadow-md bg-gray-600 text-gray-100"
            >
              <p className="text-lg font-semibold break-words whitespace-normal overflow-hidden">
                Token ID: {nft.tokenId}
              </p>

              <p className="text-sm break-words whitespace-normal overflow-hidden">
                Device ID: <span className="font-medium">{nft.deviceId}</span>
              </p>

              <p className="text-sm break-words whitespace-normal overflow-hidden">
                Data Type: <span className="font-medium">{nft.dataType}</span>
              </p>

              <p className="text-sm break-words whitespace-normal overflow-hidden">
                Location: <span className="font-medium">{nft.location}</span>
              </p>

              <p className="text-sm break-words whitespace-normal overflow-hidden">
                Timestamp: <span className="font-medium">{nft.timestamp}</span>
              </p>

              <p className="text-sm break-words whitespace-normal overflow-hidden">
                Template: <span className="font-medium">{nft.metadataTemplate}</span>
              </p>

              <p className="text-sm break-words whitespace-normal overflow-hidden">
                Metadata:{" "}
                <button
                  onClick={() => openData(nft.additionalMetadata)}
                  className={`text-blue-500 hover:underline ${
                    !nft.additionalMetadata
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={!nft.additionalMetadata}
                >
                  Get Data
                </button>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-700">
          No NFTs found for this device
        </p>
      )}
    </div>
  );
}

export default DeviceNFTs;
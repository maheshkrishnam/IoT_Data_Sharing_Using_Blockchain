import { useState } from "react";
import { useAccount } from "wagmi";
import { useContract } from "../hooks/useContract";
import { formatEther } from "viem";
import { toast } from "react-hot-toast";

export function DataNFT({ tokenId, price, seller }) {
  const { address } = useAccount();
  const [accessHours, setAccessHours] = useState(24);
  const [newMetadata, setNewMetadata] = useState("");

  const [showSellerInfo, setShowSellerInfo] = useState(false);
  const { data: sellerRating } = useContract("Marketplace", "getSellerRating", [
    seller,
  ]);

  // Contract interactions
  const { data: nft } = useContract("IoTDataNFT", "tokenURI", [tokenId]);
  const { data: isVerifier } = useContract("AccessControl", "isVerifier", [
    address,
  ]);
  const { data: isOwner } = useContract("IoTDataNFT", "ownerOf", [tokenId], {
    select: (data) => data === address,
  });

  const { execute: buy } = useContract("Marketplace", "buyItem", [tokenId], {
    value: price,
  });

  const { execute: buyAccess } = useContract(
    "Marketplace",
    "purchaseAccess",
    [tokenId, accessHours],
    { value: (price * BigInt(accessHours)) / BigInt(24) }
  );

  const { execute: updateMetadata } = useContract(
    "IoTDataNFT",
    "updateMetadata",
    [tokenId, newMetadata]
  );

  const { execute: verify } = useContract("DataVerification", "verifyData", [
    tokenId,
    true,
    "",
  ]);

  const handleBuy = async () => {
    try {
      await buy();
      toast.success("NFT purchased successfully!");
    } catch (error) {
      toast.error(`Purchase failed: ${error.shortMessage}`);
    }
  };

  const handleBuyAccess = async () => {
    try {
      await buyAccess();
      toast.success(`Access granted for ${accessHours} hours`);
    } catch (error) {
      toast.error(`Access purchase failed: ${error.shortMessage}`);
    }
  };

  const handleUpdateMetadata = async () => {
    try {
      await updateMetadata();
      toast.success("Metadata updated!");
    } catch (error) {
      toast.error(`Update failed: ${error.shortMessage}`);
    }
  };

  const handleVerify = async () => {
    try {
      await verify();
      toast.success("Data verified!");
    } catch (error) {
      toast.error(`Verification failed: ${error.shortMessage}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4">
        <h3 className="font-medium text-lg">
          {nft?.name || `Data NFT #${tokenId}`}
        </h3>
        <p className="text-gray-600 text-sm mt-1">{nft?.description}</p>

        <div className="mt-2">
          <button
            onClick={() => setShowSellerInfo(!showSellerInfo)}
            className="text-xs text-blue-600 hover:underline"
          >
            {showSellerInfo
              ? "Hide seller info"
              : `Seller: ${seller.slice(0, 6)}...${seller.slice(-4)}`}
          </button>

          {showSellerInfo && (
            <div className="mt-1 p-2 bg-gray-50 rounded text-xs">
              <p>Seller Rating: {sellerRating || "Not rated"}</p>
              <p>Address: {seller}</p>
              <button
                onClick={() => navigator.clipboard.writeText(seller)}
                className="text-blue-600 hover:text-blue-800 mt-1"
              >
                Copy Address
              </button>
            </div>
          )}
        </div>

        {isOwner && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="New metadata URI"
              className="w-full p-2 border rounded text-sm"
              value={newMetadata}
              onChange={(e) => setNewMetadata(e.target.value)}
            />
            <button
              onClick={handleUpdateMetadata}
              className="mt-1 text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
            >
              Update Metadata
            </button>
          </div>
        )}

        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold">{formatEther(price)} ETH</span>
            <button
              onClick={handleBuy}
              className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
            >
              Buy Full NFT
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="720"
              value={accessHours}
              onChange={(e) => setAccessHours(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm w-16">{accessHours}h</span>
            <button
              onClick={handleBuyAccess}
              className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700"
            >
              License
            </button>
          </div>
        </div>

        {isVerifier && (
          <button
            onClick={handleVerify}
            className="mt-3 w-full bg-purple-600 text-white py-1.5 rounded text-sm hover:bg-purple-700"
          >
            Verify Data
          </button>
        )}
      </div>
    </div>
  );
}

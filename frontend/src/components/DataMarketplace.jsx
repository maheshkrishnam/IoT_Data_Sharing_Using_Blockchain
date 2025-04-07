import { useState } from "react";
import { useContract } from "../hooks/useContract";
import { DataNFT } from "./DataNFT";

export default function DataMarketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: listings = [], isLoading } = useContract(
    "Marketplace",
    "getAllListings"
  );

  const filteredListings = listings.filter((listing) =>
    listing.metadata?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow p-4 h-64 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search data listings..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <DataNFT
            key={listing.tokenId}
            tokenId={listing.tokenId}
            price={listing.price}
            seller={listing.seller}
          />
        ))}
      </div>
    </div>
  );
}

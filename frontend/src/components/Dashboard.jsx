import { useAccount } from "wagmi";
import { useContract } from "../hooks/useContract";
import { formatEther } from "viem";

export default function Dashboard() {
  const { address } = useAccount();

  // Fetch user's NFTs
  const { data: ownedNFTs = [] } = useContract("IoTDataNFT", "getNFTsByOwner", [
    address,
  ]);

  // Fetch user's listings with prices
  const { data: userListings = [] } = useContract(
    "Marketplace",
    "getListingsBySeller",
    [address]
  );

  // Calculate total sales value
  const totalSalesValue = userListings.reduce(
    (sum, listing) => sum + (listing.sold ? BigInt(listing.price) : 0n),
    0n
  );

  // Fetch seller rating
  const { data: sellerRating = 0 } = useContract(
    "Marketplace",
    "getSellerRating",
    [address]
  );

  return (
    <div className="p-6 space-y-6">
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Owned Data NFTs" value={ownedNFTs.length} />
        <StatCard title="Active Listings" value={userListings.length} />
        <StatCard
          title="Total Sales"
          value={`${formatEther(totalSalesValue)} ETH`}
        />
        <StatCard
          title="Seller Rating"
          value={<StarRating rating={sellerRating} />}
        />
      </div>

      {/* Owned NFTs Section */}
      <Section title="Your Data NFTs">
        {ownedNFTs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ownedNFTs.map((nft) => (
              <NFTCard key={nft.tokenId} nft={nft} />
            ))}
          </div>
        ) : (
          <NoData text="You don't own any data NFTs yet." />
        )}
      </Section>

      {/* Sales History */}
      <Section title="Sales History">
        {userListings.some((listing) => listing.sold) ? (
          <SalesHistory listings={userListings} />
        ) : (
          <NoData text="No sales history yet." />
        )}
      </Section>
    </div>
  );
}

/** Stats Card Component */
function StatCard({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md text-center">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="text-2xl font-bold text-gray-800">
        {value}
      </div>
    </div>
  );
}

/** Section Wrapper */
function Section({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}

/** NFT Card */
function NFTCard({ nft }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-gray-50">
      <h3 className="font-medium">
        {nft.metadata?.name || `NFT #${nft.tokenId}`}
      </h3>
      <p className="text-sm text-gray-600 truncate">
        {nft.metadata?.description}
      </p>
      {nft.price && (
        <p className="text-sm font-medium mt-2">
          Price: {formatEther(nft.price)} ETH
        </p>
      )}
      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm font-medium">
          {nft.isListed ? "Listed" : "Not Listed"}
        </span>
        {!nft.isListed && (
          <button className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            List for Sale
          </button>
        )}
      </div>
    </div>
  );
}

/** Sales History Table */
function SalesHistory({ listings }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              NFT
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {listings
            .filter((listing) => listing.sold)
            .map((listing) => (
              <tr key={listing.tokenId} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {listing.tokenId}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatEther(listing.price)} ETH
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(listing.soldAt * 1000).toLocaleDateString()}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

/** Star Rating Component */
function StarRating({ rating }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} filled={i < rating} />
      ))}
      <span className="ml-2 text-sm">({rating}/5)</span>
    </div>
  );
}

/** Star Icon */
function StarIcon({ filled }) {
  return (
    <svg
      className={`w-5 h-5 ${filled ? "text-yellow-400" : "text-gray-300"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

/** No Data Placeholder */
function NoData({ text }) {
  return <p className="text-gray-500 text-center">{text}</p>;
}

import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { useUserRole } from "../hooks/useUserRole";

function Navbar() {
  const { role, isConnected } = useUserRole();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Admin" },
    { path: "/templates", label: "Templates" },
    { path: "/generate-nft", label: "Generate NFT" },
    { path: "/nfts", label: "NFTs" },
    { path: "/marketplace", label: "Marketplace" },
    { path: "/verifier", label: "Verifier" },
  ];

  return (
    <nav className="w-full bg-gray-900  flex flex-col justify-between p-6">
      <div className="space-y-4">
        {navItems.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={`block px-3 py-2 rounded-md transition-all ${
              location.pathname === path
                ? "bg-blue-600  font-semibold"
                : "text-gray-300 hover:bg-gray-700 hover:"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="space-y-2 pt-6 border-t border-gray-700">
        {isConnected && (
          <span className="bg-red-500  px-3 py-1 rounded-full text-sm font-medium inline-block">
            {role}
          </span>
        )}
        <ConnectButton chainStatus="icon" accountStatus="avatar" />
      </div>
    </nav>
  );
}

export default Navbar;

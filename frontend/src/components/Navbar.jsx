import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { useUserRole } from "../hooks/useUserRole";

function Navbar() {
  const { role, isConnected } = useUserRole();
  const location = useLocation();

  const navItems = [
    { path: "/templates", label: "Templates" },
    { path: "/generate-nft", label: "Generate NFT" },
    { path: "/nfts", label: "NFTs" },
    { path: "/marketplace", label: "Marketplace" },
    { path: "/verifier", label: "Verifier" },
    { path: "/admin", label: "Admin" },
  ];

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex space-x-6">
        {navItems.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={`text-gray-700 hover:text-blue-500 transition-all ${
              location.pathname === path ? "text-blue-500 font-semibold border-b-2 border-blue-500" : ""
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        {isConnected && (
          <span className="bg-red-200 px-3 py-1 rounded-lg text-sm font-medium">
            {role}
          </span>
        )}
        <ConnectButton chainStatus="icon" accountStatus="avatar" />
      </div>
    </nav>
  );
}

export default Navbar;

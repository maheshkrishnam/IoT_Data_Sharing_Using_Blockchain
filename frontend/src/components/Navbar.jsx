import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRole } from "../hooks/useRole.js";

export default function Navbar() {
  const { isAdmin, isDevice, isVerifier, isBuyer, isConnected } = useRole();

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">IoT Data NFT</h1>
        <div className="flex items-center space-x-4">
          {isConnected && (
            <span>
              Role:{" "}
              {isAdmin
                ? "Admin"
                : isDevice
                ? "Device"
                : isVerifier
                ? "Verifier"
                : isBuyer
                ? "Buyer"
                : "Common"}
            </span>
          )}
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}

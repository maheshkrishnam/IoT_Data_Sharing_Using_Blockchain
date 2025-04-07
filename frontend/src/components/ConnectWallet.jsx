import { useState } from "react";
import { useAccount, useDisconnect, useBalance, useChainId } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, arbitrum } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";
import { formatEther } from "viem";

export function ConnectWallet() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  const { data: balance } = useBalance({
    address,
    watch: true,
  });

  const chainNames = {
    [mainnet.id]: "Ethereum",
    [polygon.id]: "Polygon",
    [arbitrum.id]: "Arbitrum",
  };

  return (
    <ConnectButton.Custom>
      {({ openConnectModal, mounted }) => {
        if (!mounted) return null;

        return (
          <div className="relative">
            {!isConnected ? (
              <button
                onClick={openConnectModal}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors font-medium"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                  <span className="hidden md:inline-flex items-center">
                    {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
                    {balance && (
                      <span className="ml-2 text-xs text-gray-300">
                        {parseFloat(formatEther(balance.value)).toFixed(4)}{" "}
                        {balance.symbol}
                      </span>
                    )}
                  </span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium text-gray-900">
                        Connected Wallet
                      </p>
                      <p className="text-xs text-gray-500 mt-1 break-all">
                        {address}
                      </p>
                    </div>

                    <div className="px-4 py-2 border-b">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Network:</span>
                        <span className="font-medium">
                          {chainNames[chainId] || `Chain ID: ${chainId}`}
                        </span>
                      </div>
                      {balance && (
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-gray-500">Balance:</span>
                          <span className="font-medium">
                            {parseFloat(formatEther(balance.value)).toFixed(4)}{" "}
                            {balance.symbol}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        disconnect();
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

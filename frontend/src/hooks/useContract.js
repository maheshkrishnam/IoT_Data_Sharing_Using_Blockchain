import { usePublicClient, useWalletClient } from "wagmi";
import { CONTRACTS } from "../constants/contracts";

export function useContract(contractName, functionName, args = [], options = {}) {
  const contract = CONTRACTS[contractName];
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const read = async () => {
    try {
      return await publicClient.readContract({
        address: contract.address,
        abi: contract.abi,
        functionName,
        args,
        ...options,
      });
    } catch (error) {
      console.error("Read contract error:", error);
      return null;
    }
  };

  const write = async () => {
    if (!walletClient) throw new Error("Wallet not connected");

    try {
      const tx = await walletClient.writeContract({
        address: contract.address,
        abi: contract.abi,
        functionName,
        args,
        ...options,
      });

      return tx;
    } catch (error) {
      console.error("Write contract error:", error);
      throw error;
    }
  };

  return {
    read,
    write,
    execute: write,
  };
}

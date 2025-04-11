import { useReadContract, useWriteContract } from 'wagmi';
import { contracts } from '../utils/contracts';

export function useContractRead({ contractName, functionName, args = [], options = {} }) {
  const contractConfig = contracts[contractName];
  if (!contractConfig) {
    throw new Error(`Contract ${contractName} not found in contracts config`);
  }

  return useReadContract({
    address: contractConfig.address,
    abi: contractConfig.abi,
    functionName,
    args,
    ...options,
  });
}

export function useContractWrite({ contractName, functionName }) {
  const contractConfig = contracts[contractName];
  if (!contractConfig) {
    throw new Error(`Contract ${contractName} not found in contracts config`);
  }

  const { writeContract, ...rest } = useWriteContract();

  const write = (args, overrides = {}) => {
    writeContract({
      address: contractConfig.address,
      abi: contractConfig.abi,
      functionName,
      args,
      ...overrides,
    });
  };

  return { write, ...rest };
}

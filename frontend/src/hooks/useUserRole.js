import { useAccount } from 'wagmi';
import { useContractRead } from './useContracts';

export function useUserRole() {
  const { address, isConnected } = useAccount();

  const { data: isAdminData } = useContractRead({
    contractName: 'IoTDataAccessControl',
    functionName: 'hasRole',
    args: [
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      address,
    ],
    enabled: isConnected,
  });

  const { data: isVerifierData } = useContractRead({
    contractName: 'IoTDataAccessControl',
    functionName: 'isVerifier',
    args: [address],
    enabled: isConnected,
  });

  const { data: isDeviceData } = useContractRead({
    contractName: 'IoTDataAccessControl',
    functionName: 'isDevice',
    args: [address],
    enabled: isConnected,
  });

  const { data: isBuyerData } = useContractRead({
    contractName: 'IoTDataAccessControl',
    functionName: 'isDataBuyer',
    args: [address],
    enabled: isConnected,
  });

  const isAdmin = Boolean(isAdminData);
  const isVerifier = Boolean(isVerifierData);
  const isDevice = Boolean(isDeviceData);
  const isBuyer = Boolean(isBuyerData);

  const role = isConnected
    ? isAdmin
      ? 'admin'
      : isVerifier
      ? 'verifier'
      : isDevice
      ? 'device'
      : isBuyer
      ? 'buyer'
      : 'user'
    : null;

  return { role, isAdmin, isBuyer, isDevice, isVerifier, isConnected, address };
}

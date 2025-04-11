import { useAccount } from 'wagmi';
import { useContractRead } from './useContracts';

export function useUserRole() {
  const { address, isConnected } = useAccount();

  const { data: isAdmin } = useContractRead({
    contractName: 'IoTDataAccessControl',
    functionName: 'hasRole',
    args: [
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      address,
    ],
    enabled: isConnected,
  });

  const { data: isVerifier } = useContractRead({
    contractName: 'IoTDataAccessControl',
    functionName: 'isVerifier',
    args: [address],
    enabled: isConnected,
  });

  const { data: isDevice } = useContractRead({
    contractName: 'IoTDataAccessControl',
    functionName: 'isDevice',
    args: [address],
    enabled: isConnected,
  });

  const { data: isBuyer } = useContractRead({
    contractName: 'IoTDataAccessControl',
    functionName: 'isDataBuyer',
    args: [address],
    enabled: isConnected,
  });

  const role = isConnected
    ? isAdmin
      ? 'admin'
      : isVerifier
      ? 'verifier'
      : isDevice
      ? 'device'
      : isBuyer
      ? 'buyer'
      : 'common'
    : null;

  console.log('isAdmin:', isAdmin);
  console.log('isVerifier:', isVerifier);
  console.log('isDevice:', isDevice);
  console.log('isBuyer:', isBuyer);

  return { role, isConnected, address };
}

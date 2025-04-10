import { useAccount } from 'wagmi';
import { useContract } from './useContract';

export const useRole = () => {
  const { address, isConnected } = useAccount();

  const { data: isAdmin } = useContract(
    'IoTDataAccessControl',
    'hasRole',
    ['0x0000000000000000000000000000000000000000000000000000000000000000', address]
  );

  const { data: isDevice } = useContract(
    'IoTDataAccessControl',
    'isDevice',
    [address]
  );

  const { data: isVerifier } = useContract(
    'IoTDataAccessControl',
    'isVerifier',
    [address]
  );

  const { data: isBuyer } = useContract(
    'IoTDataAccessControl',
    'isDataBuyer',
    [address]
  );

  return {
    isAdmin: isAdmin || false,
    isDevice: isDevice || false,
    isVerifier: isVerifier || false,
    isBuyer: isBuyer || false,
    isConnected,
    address,
  };
};

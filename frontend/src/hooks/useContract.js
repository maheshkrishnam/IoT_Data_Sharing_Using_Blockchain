import { useReadContract } from 'wagmi';

const contractAddresses = {
  IoTDataAccessControl: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  Marketplace: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  IoTDataNFT: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  DataVerification: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
  Payment: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
  IoTDataFactory: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
};

import IoTDataNFTABI from '../contracts/IoTDataNFT.json';
import IoTDataAccessControlABI from '../contracts/IoTDataAccessControl.json';
import IoTDataFactoryABI from '../contracts/IoTDataFactory.json';
import DataVerificationABI from '../contracts/DataVerification.json';
import MarketplaceABI from '../contracts/Marketplace.json';
import PaymentABI from '../contracts/Payment.json';

const contractABIs = {
  IoTDataNFT: IoTDataNFTABI.abi,
  IoTDataAccessControl: IoTDataAccessControlABI.abi,
  IoTDataFactory: IoTDataFactoryABI.abi,
  DataVerification: DataVerificationABI.abi,
  Marketplace: MarketplaceABI.abi,
  Payment: PaymentABI.abi,
};

export const useContract = (contractName, functionName, args = []) => {
  const config = {
    address: contractAddresses[contractName],
    abi: contractABIs[contractName],
    functionName,
    args,
  };

  const { data, isLoading, error } = useReadContract(config);

  return { data, isLoading, error };
};

import PaymentABI from '../abis/Payment.json';
import IoTDataNFTABI from '../abis/IoTDataNFT.json';
import MarketplaceABI from '../abis/Marketplace.json';
import AccessControlABI from '../abis/IoTDataAccessControl.json';
import DataVerificationABI from '../abis/DataVerification.json';
import IoTDataFactoryABI from '../abis/IoTDataFactory.json';

export const CONTRACTS = {
  Payment: {
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    abi: PaymentABI.abi
  },
  IoTDataNFT: {
    address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    abi: IoTDataNFTABI.abi
  },
  Marketplace: {
    address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    abi: MarketplaceABI.abi
  },
  AccessControl: {
    address: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    abi: AccessControlABI.abi
  },
  DataVerification: {
    address: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    abi: DataVerificationABI.abi
  },
  IoTDataFactory: {
    address: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    abi: IoTDataFactoryABI.abi
  }
};
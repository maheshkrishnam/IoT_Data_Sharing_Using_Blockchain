import PaymentABI from '../abis/Payment.json';
import IoTDataNFTABI from '../abis/IoTDataNFT.json';
import MarketplaceABI from '../abis/Marketplace.json';
import AccessControlABI from '../abis/IoTDataAccessControl.json';
import DataVerificationABI from '../abis/DataVerification.json';
import IoTDataFactoryABI from '../abis/IoTDataFactory.json';

export const CONTRACTS = {
  Payment: {
    address: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
    abi: PaymentABI.abi
  },
  IoTDataNFT: {
    address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    abi: IoTDataNFTABI.abi
  },
  Marketplace: {
    address: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
    abi: MarketplaceABI.abi
  },
  AccessControl: {
    address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    abi: AccessControlABI.abi
  },
  DataVerification: {
    address: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
    abi: DataVerificationABI.abi
  },
  IoTDataFactory: {
    address: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
    abi: IoTDataFactoryABI.abi
  }
};
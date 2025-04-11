import DataVerificationArtifact from '../contracts/DataVerification.json';
import IoTDataAccessControlArtifact from '../contracts/IoTDataAccessControl.json';
import IoTDataFactoryArtifact from '../contracts/IoTDataFactory.json';
import IoTDataNFTArtifact from '../contracts/IoTDataNFT.json';
import MarketplaceArtifact from '../contracts/Marketplace.json';
import PaymentArtifact from '../contracts/Payment.json';

export const contracts = {
  DataVerification: {
    address: import.meta.env.VITE_DATA_VERIFICATION_ADDRESS,
    abi: DataVerificationArtifact.abi,
  },
  IoTDataAccessControl: {
    address: import.meta.env.VITE_ACCESS_CONTROL_ADDRESS,
    abi: IoTDataAccessControlArtifact.abi,
  },
  IoTDataFactory: {
    address: import.meta.env.VITE_IOT_DATA_FACTORY_ADDRESS,
    abi: IoTDataFactoryArtifact.abi,
  },
  IoTDataNFT: {
    address: import.meta.env.VITE_IOT_DATA_NFT_ADDRESS,
    abi: IoTDataNFTArtifact.abi,
  },
  Marketplace: {
    address: import.meta.env.VITE_MARKETPLACE_ADDRESS,
    abi: MarketplaceArtifact.abi,
  },
  Payment: {
    address: import.meta.env.VITE_PAYMENT_ADDRESS,
    abi: PaymentArtifact.abi,
  },
};

# IoT Data sharing using Blockchain
- In this project we have implemented a marketplace where a device can upload its data in form of NFT and other users can use it

## Requirements
### Must
- Node.js
- Metamask setup


## Installation
- Get the repo
```
git clone https://github.com/maheshkrishnam/IoT_Data_Sharing_Using_Blockchain.git
```

### Installation
- Install dependencies
  - (Go to contracts and frontend folder and run this command)
```
npm install
```
- Now you have all the dependencies

## Environment variable setup
> Now lets setup your environement variables (env in frontend and contracts)
  - This will be the template for your env

### For Frontend
- You will get these addresses when you will deploy the contracts (Deployment section)
- You will have to login to pinata and get the `VITE_PINATA_API_KEY` and `VITE_PINATA_API_SECRET`
```
VITE_PINATA_API_KEY =
VITE_PINATA_API_SECRET =
VITE_ACCESS_CONTROL_ADDRESS = 0x...
VITE_MARKETPLACE_ADDRESS = 0x...
VITE_IOT_DATA_NFT_ADDRESS = 0x...
VITE_DATA_VERIFICATION_ADDRESS = 0x...
VITE_PAYMENT_ADDRESS = 0x...
VITE_IOT_DATA_FACTORY_ADDRESS = 0x...
VITE_INFURA_PROJECT_ID =
```

### For Contracts
- Only when using sepolia for deployment
- If you are using testnet then sign in on `infura` and `ethersacn` to get these keys
- Private key will be private key of your metamask sepolia testnet account from which you want to deploy this contract
```
PRIVATE_KEY = 0x...
INFURA_PROJECT_ID =
ETHERSCAN_API_KEY =
```

- Now you have done the setup of both .env

## Configuration
### Localhost
- Comment out or remove the `sepolia` portion in `wagmi.js` inside `src` folder
- Comment out or remove `sepolia` and `etherscan` from hardhat.config.js


## Contract Deployment
> After running below command in terminal of contracts folder you will get `addresses` for each contract which you have to set in `Frontend .env`
#### Localhost
```
npx hardhat node
```
- Open onother terminal

```
npx hardhat run scripts/deploy.js --network localhost
```

#### Sepolia
```
npx hardhat run scripts/deploy.js --network seplolia
```

### Finalizing .env
- `Addresses` that you get after running the above script/deploy.js code, set them into the `frontend.env`


## Frontend Deployment
- Open new terminal in `frontend` folder
```
npm run dev
```
- Open link `http://localhost:5173/` to use the App


## How to use the App

- Connect to Metamask (localhost/sepolia based on your use case)
- Connect to account which you have used to deploy the contract

## Now you run the `IoT Data Marketplace` App
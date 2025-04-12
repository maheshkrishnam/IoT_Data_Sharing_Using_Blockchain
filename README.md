# IoT Data sharing using Blockchain
- In this project we have implemented a marketplace where a device can register its data in form of NFT and other users can use it from there

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

## Contract Deployment
> After running this command in terminal you will get `addresses` for each contract which you have to set in `Frontend .env`
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

### Setting up .env
> Now lets setup your environement variables (env in frontend and contracts)
  - This will be the template for your env

#### For Frontend
- You will get these addresses when you will deploy the contracts (Deployment section)
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

#### For Contracts
- Only when using sepolia for deployment
```
PRIVATE_KEY = 0x...
INFURA_PROJECT_ID =
ETHERSCAN_API_KEY =
```

- Now you have done the setup of both .env

## Configuration
### Localhost
- If you have not filed the .env files as instructed then comment out the portion asking for those variables.

## Frontend Deployment
```
npm run dev
```
- Open link `http://localhost:5173/` to get frontend

- Now you can test this project
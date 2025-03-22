import os
from pathlib import Path

# Define the folder structure
folder_structure = {
    "backend": {
        "config": ["db.js", "ipfs.js", "blockchain.js", "dotenv.example"],
        "controllers": [
            "authController.js",
            "dataController.js",
            "paymentController.js",
            "smartContractController.js",
            "iotController.js",
        ],
        "models": [
            "userModel.js",
            "dataModel.js",
            "transactionModel.js",
            "iotDataModel.js",
        ],
        "routes": [
            "authRoutes.js",
            "dataRoutes.js",
            "paymentRoutes.js",
            "contractRoutes.js",
            "iotRoutes.js",
        ],
        "middleware": [
            "authMiddleware.js",
            "errorHandler.js",
            "dataValidation.js",
        ],
        "utils": [
            "generateHash.js",
            "validateData.js",
            "encryptData.js",
            "simulateData.js",
        ],
        "smart-contracts": {
            "contracts": [
                "IoTDataNFT.sol",
                "Marketplace.sol",
                "Payment.sol",
                "AccessControl.sol",
            ],
            "scripts": ["deploy.js", "interact.js"],
            "hardhat.config.js": None,
        },
        "storage": ["metadata.json"],
        "server.js": None,
    },
    "frontend": {
        "public": ["logo.png", "favicon.ico"],
        "src": {
            "components": [
                "Navbar.js",
                "DatasetCard.js",
                "WalletConnect.js",
                "Modal.js",
                "DataPreview.js",
            ],
            "pages": {
                "index.js": None,
                "upload.js": None,
                "dataset": {
                    "[id].js": None,  # Handle dynamic route file
                },
                "profile.js": None,
                "transactions.js": None,
            },
            "context": ["BlockchainContext.js"],
            "utils": [
                "convertCrypto.js",
                "fetchMetadata.js",
                "searchFilters.js",
            ],
            "styles": ["globals.css", "dataset.module.css"],
            "_app.js": None,
            "_document.js": None,
        },
        "package.json": None,
    },
    "blockchain": {
        "scripts": ["deployContracts.js", "interactContracts.js"],
    },
    "docs": [
        "README.md",
        "API_DOCS.md",
        "ARCHITECTURE.md",
        "USER_GUIDE.md",
    ],
    "scripts": ["simulateIoTData.js"],
    ".env": None,
    ".gitignore": None,
    "README.md": None,
    "LICENSE": None,
}

# Function to create folders and files
def create_structure(base_path, structure):
    for name, content in structure.items():
        path = Path(base_path) / name
        if isinstance(content, dict):
            # Create directory and recurse
            path.mkdir(parents=True, exist_ok=True)
            create_structure(path, content)
        elif isinstance(content, list):
            # Create directory and files
            path.mkdir(parents=True, exist_ok=True)
            for file in content:
                file_path = path / file
                file_path.touch(exist_ok=True)
        else:
            # Create file
            path.touch(exist_ok=True)

# Create the folder structure
if __name__ == "__main__":
    base_dir = "IoT-Data-Marketplace"
    create_structure(base_dir, folder_structure)
    print(f"Folder structure created at: {os.path.abspath(base_dir)}")
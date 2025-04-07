import { Link } from "react-router-dom";
import { ConnectWallet } from "./ConnectWallet";

const Header = () => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" aria-label="Go to homepage">
        <h1 className="text-2xl font-bold text-gray-900 hover:text-blue-500 transition-colors">
          IoT Data Marketplace
        </h1>
      </Link>

      <div>
        <ConnectWallet />
      </div>
    </header>
  );
};

export default Header;

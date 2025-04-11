import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Menu } from "antd";
import "@rainbow-me/rainbowkit/styles.css";
import { icons } from "antd/es/image/PreviewGroup";
import { useUserRole } from "../hooks/useUserRole";

function Navbar() {
  const items = [
    { key: "dashboard", label: <Link to="/">Dashboard</Link> },
    { key: "templates", label: <Link to="/templates">Templates</Link> },
    {
      key: "generate-nft",
      label: <Link to="/generate-nft">Generate NFT</Link>,
    },
    { key: "nfts", label: <Link to="/nfts">NFTs</Link> },
    { key: "marketplace", label: <Link to="/marketplace">Marketplace</Link> },
    { key: "sales", label: <Link to="/sales">Sales</Link> },
    { key: "admin", label: <Link to="/admin">Admin</Link> },
  ];

  const { role, isConnected } = useUserRole();

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow">
      <Menu mode="horizontal" items={items} className="flex-1" />
      {isConnected && (
        <div className="bg-red-200  px-2 py-1 rounded-lg mr-2"> {role} </div>
      )}
      <ConnectButton chainStatus={icons} accountStatus="avatar" />
    </div>
  );
}

export default Navbar;

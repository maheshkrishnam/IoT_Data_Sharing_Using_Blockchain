import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function ConnectWallet() {
  return (
    <div className="fixed top-4 right-4">
      <ConnectButton
        showBalance={false}
        chainStatus="none"
        accountStatus="address"
      />
    </div>
  );
}

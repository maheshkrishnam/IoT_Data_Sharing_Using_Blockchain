import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Welcome to IoT Data NFT</h2>
        <p>Connect your wallet to get started!</p>
      </div>
    </div>
  );
}
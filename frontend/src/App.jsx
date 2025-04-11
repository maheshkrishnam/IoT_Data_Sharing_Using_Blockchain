// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import GenerateNFT from './pages/GenerateNFT';
import NFTs from './pages/NFTs';
import Marketplace from './pages/Marketplace';
import Sales from './pages/Sales';
import Admin from './pages/Admin';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/generate-nft" element={<GenerateNFT />} />
        <Route path="/nfts" element={<NFTs />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Layout>
  );
}

export default App;
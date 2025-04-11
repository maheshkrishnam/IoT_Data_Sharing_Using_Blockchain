// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Templates from './pages/Templates';
import GenerateNFT from './pages/GenerateNFT';
import NFTs from './pages/NFTs';
import Marketplace from './pages/Marketplace';
import Verifier from './pages/Verifier';
import Admin from './pages/Admin';
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/templates" element={<Templates />} />
        <Route path="/generate-nft" element={<GenerateNFT />} />
        <Route path="/nfts" element={<NFTs />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/verifier" element={<Verifier />} />
      </Routes>
      <Toaster position="bottom-right" />
    </Layout>
  );
}

export default App;
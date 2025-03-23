import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api');
        const result = await response.text();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Welcome to IoT Data Sharing DApp
      </h1>
      <p className="text-gray-700 text-lg mb-8">
        A decentralized platform for sharing IoT data securely.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Backend Status
        </h2>
        <p className="text-gray-600">
          {data || 'Connecting to backend...'}
        </p>
      </div>
    </div>
  );
}

export default App;
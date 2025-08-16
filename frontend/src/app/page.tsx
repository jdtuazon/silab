'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Home() {
  const [apiStatus, setApiStatus] = useState<string>('Checking...');

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await api.get('/health');
        setApiStatus(`API is ${response.status}`);
      } catch (error) {
        setApiStatus('API connection failed');
      }
    };

    checkApiHealth();
  }, []);

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-8">DataWave Application</h1>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Frontend</h2>
            <p className="text-green-600">Next.js ✓</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Backend</h2>
            <p className={apiStatus.includes('healthy') ? 'text-green-600' : 'text-red-600'}>
              FastAPI: {apiStatus}
            </p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Database</h2>
            <p className="text-blue-600">MongoDB Atlas (configured)</p>
          </div>
        </div>
      </main>
    </div>
  );
}

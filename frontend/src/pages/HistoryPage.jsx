import React, { useState, useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Navbar from '../components/common/Navbar';
import AnalysisHistory from '../components/analysis/AnalysisHistory';
import { gaitService } from '../services/gaitService';
import { Toaster } from 'react-hot-toast';

const HistoryPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHistory = async () => {
    setLoading(true);
    try {
      const result = await gaitService.getDetectionHistory(100);
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to load history');
      }
    } catch (err) {
      setError('An error occurred while fetching history');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleRecordDeleted = (id) => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Navbar title="Analysis History" />
        <Toaster position="top-right" />
        <div className="page-container">
          <AnalysisHistory 
            data={data} 
            loading={loading} 
            error={error} 
            onRecordDeleted={handleRecordDeleted}
          />
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;


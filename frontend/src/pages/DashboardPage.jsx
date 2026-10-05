import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Navbar from '../components/common/Navbar';
import DashboardHome from '../components/dashboard/DashboardHome';

const DashboardPage = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Navbar title="Dashboard Overview" />
        <DashboardHome />
      </main>
    </div>
  );
};

export default DashboardPage;
